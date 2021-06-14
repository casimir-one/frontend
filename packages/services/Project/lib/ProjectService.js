import { Singleton } from '@deip/toolbox';
import { ProjectHttp } from './ProjectHttp';
import { proxydi } from '@deip/proxydi';
import crypto from '@deip/lib-crypto';
import deipRpc from '@deip/rpc-client';
import { MultipartFormDataMessage, ApplicationJsonMessage } from '@deip/request-models';
import {
  APP_PROPOSAL,
  CmdEnvelope,
  ProtocolRegistry,
  CreateProjectCmd,
  UpdateProjectCmd,
  DeleteProjectCmd,
  CreateProposalCmd,
  CreateAccountCmd,
  JoinProjectTeamCmd,
  UpdateProposalCmd,
  LeaveProjectTeamCmd
} from '@deip/command-models';


// TODO: move to constants
const proposalDefaultLifetime = new Date(new Date().getTime() + 86400000 * 365 * 3).toISOString().split('.')[0]; // 3 years

class ProjectService extends Singleton {
  projectHttp = ProjectHttp.getInstance();
  proxydi = proxydi;
  deipRpc = deipRpc;
  
  
  getProject(projectId) {
    return this.projectHttp.getProject(projectId);
  }

  getProjects(projectsIds) {
    return this.projectHttp.getProjects(projectsIds);
  }

  getTeamDefaultProject(teamId) {
    return this.projectHttp.getTeamDefaultProject(teamId);
  }

  createProject({ privKey }, {
    isAdmin,
    teamId,
    creator,
    domains,
    isPrivate,
    members,
    attributes,
    memoKey,
    formData
  },
    proposalInfo) {

    const { isProposal, isProposalApproved, proposalLifetime } =
      Object.assign({
        isProposal: false,
        isProposalApproved: true,
        proposalLifetime: proposalDefaultLifetime
      }, proposalInfo);

    const { TENANT } = this.proxydi.get('env');
    const { PROTOCOL } = this.proxydi.get('env');
    const { IS_TESTNET } = this.proxydi.get('env');

    const protocolRegistry = new ProtocolRegistry(PROTOCOL);
    const txBuilder = protocolRegistry.getTransactionsBuilder();

    const isNewProjectTeam = teamId === null;
    const teamMembers = [];

    let projectId;
    return Promise.all([
      isNewProjectTeam
        ? Promise.resolve([])
        : this.deipRpc.api.getTeamMemberReferencesAsync([teamId], false)
    ])
      .then(([refs]) => {
        const [list] = refs.length ? refs.map((g) => g.map(m => m.account)) : [[]];
        teamMembers.push(...list);
        return txBuilder.begin();
      })
      .then(() => {

        if (isNewProjectTeam) {

          const authoritySetup = {
            auths: [],
            weight: 1
          };

          if (isAdmin) {
            authoritySetup.auths.push({ name: TENANT, weight: 1 })
          }

          const projectTeamMembers = members
            .filter(member => !teamMembers.some((m) => m === member))
            .reduce((acc, member) => {
              return acc.some(m => m === member) ? acc : [...acc, member];
            }, [])
            .map(member => ({ name: member, weight: 1 }));

          authoritySetup.auths.push(...projectTeamMembers);

          const createAccountCmd = new CreateAccountCmd({
            isTeamAccount: true,
            fee: `0.000 ${IS_TESTNET ? 'TESTS' : 'DEIP'}`,
            creator: creator,
            authority: {
              owner: authoritySetup,
              active: authoritySetup
            },
            memoKey: memoKey,
            description: crypto.hexify(crypto.sha256(new TextEncoder('utf-8').encode(JSON.stringify({})).buffer)),
            attributes: []
          }, txBuilder.getTxCtx());

          txBuilder.addCmd(createAccountCmd);
          teamId = createAccountCmd.getProtocolEntityId();
        }

        const createProjectCmd = new CreateProjectCmd({
          teamId: teamId,
          description: crypto.hexify(crypto.sha256(new TextEncoder('utf-8').encode(JSON.stringify(attributes)).buffer)),
          domains: domains,
          isPrivate: isPrivate,
          members: undefined,
          attributes: attributes
        }, txBuilder.getTxCtx());

        projectId = createProjectCmd.getProtocolEntityId();

        if (isProposal) {

          const createProposalCmd = new CreateProposalCmd({
            type: APP_PROPOSAL.PROJECT_PROPOSAL,
            creator: creator,
            expirationTime: proposalLifetime || proposalDefaultLifetime,
            proposedCmds: [createProjectCmd]
          }, txBuilder.getTxCtx());

          txBuilder.addCmd(createProposalCmd);

          if (isProposalApproved) {
            const projectProposalId = createProposalCmd.getProtocolEntityId();
            const updateProposalCmd = new UpdateProposalCmd({
              entityId: projectProposalId,
              activeApprovalsToAdd: [creator]
            }, txBuilder.getTxCtx());

            txBuilder.addCmd(updateProposalCmd);
          }

        } else {
          txBuilder.addCmd(createProjectCmd);
        }

        return txBuilder.end();
      })
      .then((txEnvelop) => {
        txEnvelop.sign(privKey);
        const msg = new MultipartFormDataMessage(formData, txEnvelop, { 'entity-id': projectId });
        return this.projectHttp.createProject(msg);
      });

  }


  updateProject({ privKey }, {
    projectId,
    teamId,
    isPrivate,
    members,
    updater,
    attributes,
    formData
  },
    proposalInfo) {

    const { isProposal, isProposalApproved, proposalLifetime } =
      Object.assign({
        isProposal: false,
        isProposalApproved: true,
        proposalLifetime: proposalDefaultLifetime
      }, proposalInfo);

    const { TENANT } = this.proxydi.get('env');
    const { PROTOCOL } = this.proxydi.get('env');

    const protocolRegistry = new ProtocolRegistry(PROTOCOL);
    const txBuilder = protocolRegistry.getTransactionsBuilder();

    const teamMembers = [];
    return Promise.all([
      this.deipRpc.api.getTeamMemberReferencesAsync([teamId], false),
      txBuilder.begin()
    ])
      .then(([refs]) => {
        const [list] = refs.length ? refs.map((g) => g.map(m => m.account)) : [[]];
        teamMembers.push(...list);

        const joinedMembers = members ? members.filter(member => !teamMembers.includes(member)) : [];
        const leftMembers = members ? teamMembers.filter(member => !members.includes(member) && member != TENANT) : [];

        const invites = joinedMembers.map((invitee) => {
          const joinProjectTeamCmd = new JoinProjectTeamCmd({
            member: invitee,
            teamId: teamId,
            projectId: projectId
          }, txBuilder.getTxCtx());

          return joinProjectTeamCmd;
        });

        const leavings = leftMembers.map((leaving) => {
          const leaveProjectTeamCmd = new LeaveProjectTeamCmd({
            member: leaving,
            teamId: teamId,
            projectId: projectId
          }, txBuilder.getTxCtx());

          return leaveProjectTeamCmd;
        });


        const updateProjectCmd = new UpdateProjectCmd({
          entityId: projectId,
          teamId: teamId,
          description: crypto.hexify(crypto.sha256(new TextEncoder('utf-8').encode(JSON.stringify(attributes)).buffer)),
          isPrivate: isPrivate,
          members: undefined,
          attributes: attributes
        }, txBuilder.getTxCtx());


        if (isProposal) {

          const createProposalCmd = new CreateProposalCmd({
            type: APP_PROPOSAL.PROJECT_UPDATE_PROPOSAL,
            creator: updater,
            expirationTime: proposalLifetime || proposalDefaultLifetime,
            proposedCmds: [updateProjectCmd, ...invites, ...leavings]
          }, txBuilder.getTxCtx());

          txBuilder.addCmd(createProposalCmd);

          if (isProposalApproved) {
            const projectUpdateProposalId = createProposalCmd.getProtocolEntityId();
            const updateProposalCmd = new UpdateProposalCmd({
              entityId: projectUpdateProposalId,
              activeApprovalsToAdd: [updater]
            }, txBuilder.getTxCtx());

            txBuilder.addCmd(updateProposalCmd);
          }

        } else {
          txBuilder.addCmd(updateProjectCmd);
          for (let i = 0; i < invites.length; i++) {
            txBuilder.addCmd(invites[i]);
          }
          for (let i = 0; i < leavings.length; i++) {
            txBuilder.addCmd(leavings[i]);
          }
        }

        return txBuilder.end();
      })
      .then((txEnvelop) => {
        txEnvelop.sign(privKey);
        const msg = new MultipartFormDataMessage(formData, txEnvelop, { 'entity-id': projectId });
        return this.projectHttp.updateProject(msg);
      });

  }


  deleteProject(projectId) {
    const deleteProjectCmd = new DeleteProjectCmd({ entityId: projectId });
    const cmdEnvelope = new CmdEnvelope([deleteProjectCmd]);
    const msg = new ApplicationJsonMessage({}, cmdEnvelope, { 'entity-id': projectId });
    return this.projectHttp.deleteProject(msg);
  }

}


export {
  ProjectService
};