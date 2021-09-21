import { Singleton } from '@deip/toolbox';
import { ProjectHttp } from './ProjectHttp';
import { proxydi } from '@deip/proxydi';
import crypto from '@deip/lib-crypto';
import deipRpc from '@deip/rpc-client'; // Remove this dependency ASAP
import { MultFormDataMsg, JsonDataMsg } from '@deip/message-models';
import { APP_PROPOSAL } from '@deip/constants'
import {
  CreateProjectCmd,
  UpdateProjectCmd,
  DeleteProjectCmd,
  CreateProposalCmd,
  CreateAccountCmd,
  JoinProjectTeamCmd,
  UpdateProposalCmd,
  LeaveProjectTeamCmd
} from '@deip/command-models';
import { ChainService } from '@deip/chain-service';


// TODO: move to constants
const proposalDefaultLifetime = new Date(new Date().getTime() + 86400000 * 365 * 3).toISOString().split('.')[0]; // 3 years

class ProjectService extends Singleton {
  projectHttp = ProjectHttp.getInstance();
  proxydi = proxydi;
  deipRpc = deipRpc; // deprecated


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

    const env = this.proxydi.get('env');
    const { TENANT, IS_TESTNET } = env;
    const isNewProjectTeam = teamId === null;

    return Promise.all([
      ChainService.getInstanceAsync(env),
      isNewProjectTeam ? Promise.resolve([]) : this.deipRpc.api.getTeamMemberReferencesAsync([teamId], false)
    ])
      .then(([chainService, refs]) => {

        const teamMembers = [];
        const [list] = refs.length ? refs.map((g) => g.map(m => m.account)) : [[]];
        teamMembers.push(...list);

        const chainNodeClient = chainService.getChainNodeClient();
        const chainTxBuilder = chainService.getChainTxBuilder();

        let projectId;
        return chainTxBuilder.begin()
          .then((txBuilder) => {

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
              });

              txBuilder.addCmd(createAccountCmd);
              teamId = createAccountCmd.getProtocolEntityId();
            }

            const createProjectCmd = new CreateProjectCmd({
              teamId: teamId,
              description: crypto.hexify(crypto.sha256(new TextEncoder('utf-8').encode(JSON.stringify(attributes)).buffer)),
              domains: domains,
              isPrivate: isPrivate,
              isDefault: false,
              members: undefined,
              attributes: attributes
            });

            projectId = createProjectCmd.getProtocolEntityId();

            if (isProposal) {

              const createProposalCmd = new CreateProposalCmd({
                type: APP_PROPOSAL.PROJECT_PROPOSAL,
                creator: creator,
                expirationTime: proposalLifetime || proposalDefaultLifetime,
                proposedCmds: [createProjectCmd]
              });

              txBuilder.addCmd(createProposalCmd);

              if (isProposalApproved) {
                const projectProposalId = createProposalCmd.getProtocolEntityId();
                const updateProposalCmd = new UpdateProposalCmd({
                  entityId: projectProposalId,
                  activeApprovalsToAdd: [creator]
                });

                txBuilder.addCmd(updateProposalCmd);
              }

            } else {
              txBuilder.addCmd(createProjectCmd);
            }

            return txBuilder.end();
          })
          .then((packedTx) => {
            return packedTx.signAsync(privKey, chainNodeClient);
          })
          .then((packedTx) => {
            const msg = new MultFormDataMsg(formData, packedTx.getPayload(), { 'entity-id': projectId });
            return this.projectHttp.createProject(msg);
          });
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

    const env = this.proxydi.get('env');
    const { TENANT } = env;

    return Promise.all([
      ChainService.getInstanceAsync(env),
      this.deipRpc.api.getTeamMemberReferencesAsync([teamId], false)
    ])
      .then(([chainService, refs]) => {
        const teamMembers = [];
        const [list] = refs.length ? refs.map((g) => g.map(m => m.account)) : [[]];
        teamMembers.push(...list);

        const chainNodeClient = chainService.getChainNodeClient();
        const chainTxBuilder = chainService.getChainTxBuilder();

        return chainTxBuilder.begin()
          .then((txBuilder) => {

            const joinedMembers = members ? members.filter(member => !teamMembers.includes(member)) : [];
            const leftMembers = members ? teamMembers.filter(member => !members.includes(member) && member != TENANT) : [];

            const invites = joinedMembers.map((invitee) => {
              const joinProjectTeamCmd = new JoinProjectTeamCmd({
                member: invitee,
                teamId: teamId,
                projectId: projectId
              });

              return joinProjectTeamCmd;
            });

            const leavings = leftMembers.map((leaving) => {
              const leaveProjectTeamCmd = new LeaveProjectTeamCmd({
                member: leaving,
                teamId: teamId,
                projectId: projectId
              });

              return leaveProjectTeamCmd;
            });


            const updateProjectCmd = new UpdateProjectCmd({
              entityId: projectId,
              teamId: teamId,
              description: crypto.hexify(crypto.sha256(new TextEncoder('utf-8').encode(JSON.stringify(attributes)).buffer)),
              isPrivate: isPrivate,
              members: undefined,
              attributes: attributes
            });


            if (isProposal) {

              const createProposalCmd = new CreateProposalCmd({
                type: APP_PROPOSAL.PROJECT_UPDATE_PROPOSAL,
                creator: updater,
                expirationTime: proposalLifetime || proposalDefaultLifetime,
                proposedCmds: [updateProjectCmd, ...invites, ...leavings]
              });

              txBuilder.addCmd(createProposalCmd);

              if (isProposalApproved) {
                const projectUpdateProposalId = createProposalCmd.getProtocolEntityId();
                const updateProposalCmd = new UpdateProposalCmd({
                  entityId: projectUpdateProposalId,
                  activeApprovalsToAdd: [updater]
                });

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
          .then((packedTx) => {
            return packedTx.signAsync(privKey, chainNodeClient);
          })
          .then((packedTx) => {
            const msg = new MultFormDataMsg(formData, packedTx.getPayload(), { 'entity-id': projectId });
            return this.projectHttp.updateProject(msg);
          });
      });
  }


  deleteProject(projectId) {
    const deleteProjectCmd = new DeleteProjectCmd({ entityId: projectId });
    const msg = new JsonDataMsg({ appCmds: [deleteProjectCmd] }, { 'entity-id': projectId });
    return this.projectHttp.deleteProject(msg);
  }

  // Change all methods to cmd

  getPublicProjectListing({
    searchTerm,
    disciplines,
    organizations,
    researchAttributes,
    tenantIds
  }) {

    const filter = {
      searchTerm: searchTerm || "",
      disciplines: disciplines || [],
      organizations: organizations || [],
      researchAttributes: researchAttributes || [],
      tenantIds: tenantIds || []
    };

    return this.projectHttp.getPublicProjectListing(filter);
  }

  getUserProjectListing(username) {
    return this.projectHttp.getUserProjectListing(username);
  }

  getUserPublicProjects(username) {
    return this.projectHttp.getUserProjectListing(username)
      .then((projects) => projects.filter((p) => !p.is_private));
  }

  getUserPrivateProjects(username) {
    return this.projectHttp.getUserProjectListing(username)
      .then((projects) => projects.filter((p) => p.is_private));
  }

  getUserTeamsProjects(username) {
    return this.projectHttp.getUserProjectListing(username)
      .then((projects) => projects.filter((p) => !p.research_group.is_personal));
  }

  getUserPersonalProjects(username) {
    return this.projectHttp.getUserProjectListing(username)
      .then((projects) => projects.filter((p) => p.research_group.is_personal));
  }

  getTeamProjectListing(teamId) {
    return this.projectHttp.getTeamProjectListing(teamId);
  }

  getTenantProjectListing() {
    return this.projectHttp.getTenantProjectListing();
  }

}


export {
  ProjectService
};
