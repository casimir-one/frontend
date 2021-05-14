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
  JoinProjectCmd,
  UpdateProposalCmd
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

  createProject({ privKey }, {
    teamId,
    creator,
    domains,
    isPrivate,
    members,
    inviteLifetime,
    reviewShare,
    compensationShare,
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
    const isPersonalProject = teamId === creator;
    const teamMembers = [];

    let projectId;
    // TODO: Replace legacy deipRpc.api call with getTeamMembers call
    return Promise.all([
      isNewProjectTeam ? Promise.resolve([]) : this.deipRpc.api.getResearchGroupMembershipTokensAsync(teamId)
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

        const invitesFlows = invitees.map((invitee) => {

          const joinProjectCmd = new JoinProjectCmd({
            member: invitee,
            teamId: teamId,
            projectId: projectId
          }, txBuilder.getTxCtx());

          const createProposalCmd = new CreateProposalCmd({
            type: APP_PROPOSAL.PROJECT_INVITE_PROPOSAL,
            creator: creator,
            expirationTime: inviteLifetime || proposalDefaultLifetime,
            proposedCmds: [joinProjectCmd]
          }, txBuilder.getTxCtx());

          const inviteId = createProposalCmd.getProtocolEntityId();

          const updateProposalCmd = new UpdateProposalCmd({
            entityId: inviteId,
            activeApprovalsToAdd: [creator]
          }, txBuilder.getTxCtx());

          return [createProposalCmd, updateProposalCmd];
        });


        if (isProposal) {

          const createProposalCmd = new CreateProposalCmd({
            type: APP_PROPOSAL.PROJECT_PROPOSAL,
            creator: creator,
            expirationTime: proposalLifetime || proposalDefaultLifetime,
            proposedCmds: [createProjectCmd, ...invitesFlows.reduce((acc, invite) => {
              return [...acc, ...invite]
            }, [])]
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

          for (let i = 0; i < invitesFlows.length; i++) {
            const inviteFlow = invitesFlows[i];
            for (let j = 0; j < inviteFlow.length; j++) {
              txBuilder.addCmd(inviteFlow[j]);
            }
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


  updateProject({ privKey }, {
    projectId,
    teamId,
    isPrivate,
    members,
    inviteLifetime,
    reviewShare,
    compensationShare,
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


    const { PROTOCOL } = this.proxydi.get('env');

    const protocolRegistry = new ProtocolRegistry(PROTOCOL);
    const txBuilder = protocolRegistry.getTransactionsBuilder();
    const isPersonalProject = teamId === updater;

    const teamMembers = [];
    // TODO: Replace legacy deipRpc.api call with getTeamMembers call
    return Promise.all([
      this.deipRpc.api.getResearchGroupMembershipTokensAsync(teamId),
      this.deipRpc.api.getResearchAsync(projectId),
      this.projectHttp.getProjectPendingInvites(projectId),
      txBuilder.begin()
    ])
      .then(([list, project, invites]) => {
        teamMembers.push(...list.map(({ owner: member }) => (member)));

        const projectInvites = invites.filter(({ invitee }) => !teamMembers.some(m => m === invitee)); // for a case there is a duplicated invite
        const newProjectMembers = members ? members.filter(member => !teamMembers.some(m => m === member)) : [];
        const newProjectInvites = newProjectMembers.filter(member => !projectInvites.some(({ invitee }) => invitee === member));

        const invitesFlows = newProjectInvites.map((invitee) => {

          const joinProjectCmd = new JoinProjectCmd({
            member: invitee,
            teamId: teamId,
            projectId: projectId
          }, txBuilder.getTxCtx());

          const createProposalCmd = new CreateProposalCmd({
            type: APP_PROPOSAL.PROJECT_INVITE_PROPOSAL,
            creator: updater,
            expirationTime: inviteLifetime || proposalDefaultLifetime,
            proposedCmds: [joinProjectCmd]
          }, txBuilder.getTxCtx());

          const inviteId = createProposalCmd.getProtocolEntityId();

          const updateProposalCmd = new UpdateProposalCmd({
            entityId: inviteId,
            activeApprovalsToAdd: [updater]
          }, txBuilder.getTxCtx());

          return [createProposalCmd, updateProposalCmd];
        });

        const projectMembers = isPersonalProject || !members
          ? undefined
          : members
            .filter(member => teamMembers.some(m => m === member) && !projectInvites.some(({ invitee }) => invitee === member))
            .reduce((acc, member) => {
              return acc.some(m => m === member) ? acc : [...acc, member];
            }, []);

        const updateProjectCmd = new UpdateProjectCmd({
          entityId: projectId,
          teamId: teamId,
          description: crypto.hexify(crypto.sha256(new TextEncoder('utf-8').encode(JSON.stringify(attributes)).buffer)),
          isPrivate: isPrivate,
          reviewShare: reviewShare,
          compensationShare: compensationShare,
          members: projectMembers
            ? project.members.every(member => projectMembers.some(m => m === member)) && projectMembers.every(member => project.members.some(m => m === member))
              ? undefined
              : projectMembers
            : undefined,
          attributes: attributes
        }, txBuilder.getTxCtx());

        if (isProposal) {

          const createProposalCmd = new CreateProposalCmd({
            type: APP_PROPOSAL.PROJECT_UPDATE_PROPOSAL,
            creator: updater,
            expirationTime: proposalLifetime || proposalDefaultLifetime,
            proposedCmds: [updateProjectCmd, ...invitesFlows.reduce((acc, invite) => {
              return [...acc, ...invite]
            }, [])]
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

          for (let i = 0; i < invitesFlows.length; i++) {
            const inviteFlow = invitesFlows[i];
            for (let j = 0; j < inviteFlow.length; j++) {
              txBuilder.addCmd(inviteFlow[j]);
            }
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