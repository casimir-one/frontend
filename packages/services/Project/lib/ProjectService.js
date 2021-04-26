import { Singleton } from '@deip/toolbox';
import { ProjectHttp } from './ProjectHttp';
import { proxydi } from '@deip/proxydi';
import crypto from '@deip/lib-crypto';
import { MultipartFormDataMessage } from '@deip/request-models';
import {
  ProtocolRegistry,
  CreateProjectCmd,
  CreateProposalCmd,
  CreateAccountCmd,
  JoinProjectCmd,
  UpdateProposalCmd
} from '@deip/command-models';


class ProjectService extends Singleton {
  projectHttp = ProjectHttp.getInstance();
  proxydi = proxydi;
  

  createProject({ privKey, username }, {
    isProposal,
    teamId,
    creator,
    domains,
    isPrivate,
    members,
    reviewShare,
    compensationShare,
    attributes,
    memoKey,
    formData
  }) {

    const TENANT = this.proxydi.get('env').TENANT;
    const PROTOCOL = this.proxydi.get('env').PROTOCOL;
    const IS_TESTNET = this.proxydi.get('env').IS_TESTNET;

    const protocolRegistry = new ProtocolRegistry(PROTOCOL);
    const txBuilder = protocolRegistry.getTransactionsBuilder();

    const isNewProjectTeam = teamId === null;
    const isPersonalProject = teamId === creator;
    const teamMembers = [];

    let projectId;
    // TODO: Replace legacy deipRpc.api call with getTeamMembers call
    return Promise.all([
      isNewProjectTeam ? Promise.resolve([]) : deipRpc.api.getResearchGroupMembershipTokensAsync(teamId)
    ])
      .then(([list]) => {
        teamMembers.push(...list.map(({ owner: member }) => (member)));
        return txBuilder.begin();
      })
      .then(() => {

        if (isNewProjectTeam) {
          const createAccountCmd = new CreateAccountCmd({
            isTeamAccount: true,
            fee: `0.000 ${IS_TESTNET ? 'TESTS' : 'DEIP'}`,
            creator: creator,
            authority: {
              owner: {
                auths: [{ name: TENANT, weight: 1 }],
                weight: 1
              },
              active: {
                auths: [{ name: TENANT, weight: 1 }],
                weight: 1
              }
            },
            memoKey: memoKey,
            description: crypto.hexify(crypto.sha256(new TextEncoder('utf-8').encode(JSON.stringify({})).buffer)),
            attributes: []
          }, txBuilder.getTxCtx());

          txBuilder.addCmd(createAccountCmd);
          teamId = createAccountCmd.getProtocolEntityId();
        }


        let projectMembers;
        if (isNewProjectTeam || isPersonalProject) {
          projectMembers = [creator];
        } else {
          projectMembers = members
            .filter(m => teamMembers.some(member => member === m))
            .reduce((acc, member) => {
              return acc.some(m => m === member) ? acc : [...acc, member];
            }, []);
        }

        const createProjectCmd = new CreateProjectCmd({
          teamId: teamId,
          description: crypto.hexify(crypto.sha256(new TextEncoder('utf-8').encode(JSON.stringify(attributes)).buffer)),
          domains: domains,
          isPrivate: isPrivate,
          members: projectMembers,
          reviewShare: reviewShare,
          compensationShare: compensationShare,
          attributes: attributes
        }, txBuilder.getTxCtx());

        projectId = createProjectCmd.getProtocolEntityId();

        const invitees = members
          .filter(m => m !== creator && !teamMembers.some((member) => member === m))
          .reduce((acc, member) => {
            return acc.some(m => m === member) ? acc : [...acc, member];
        }, []);

        const invites = invitees.map((invitee) => {

          const joinProjectCmd = new JoinProjectCmd({
            member: invitee,
            teamId: teamId,
            projectId: projectId
          }, txBuilder.getTxCtx());

          const createProposalCmd = new CreateProposalCmd({
            creator: creator,
            proposedCmds: [joinProjectCmd]
          }, txBuilder.getTxCtx());

          const inviteId = createProposalCmd.getProtocolEntityId();

          const updateProposalCmd = new UpdateProposalCmd({ // auto approve
            entityId: inviteId,
            activeApprovalsToAdd: [creator]
          }, txBuilder.getTxCtx());
          
          return [createProposalCmd, updateProposalCmd];
        })


        if (isProposal) {

          const createProposalCmd = new CreateProposalCmd({
            creator: creator,
            proposedCmds: [createProjectCmd, ...invites.reduce((acc, invite) => {
              return [...acc, invite[0], invite[1]]
            }, [])]
          }, txBuilder.getTxCtx());

          txBuilder.addCmd(createProposalCmd);
        
        } else {

          txBuilder.addCmd(createProjectCmd);

          for (let i = 0; i < invites.length; i++) {
            const invite = invites[i];
            txBuilder.addCmd(invite[0]);
            txBuilder.addCmd(invite[1]);
          }
          
        }

        return txBuilder.end();
      })
      .then((txEnvelop) => {
        txEnvelop.sign(privKey);
        const msg = new MultipartFormDataMessage(formData, txEnvelop, { 'entity-id': projectId });
        return this.projectHttp.createProject(msg);
      });

  }
}


export {
  ProjectService
};