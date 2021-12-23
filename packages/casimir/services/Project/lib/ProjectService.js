import { ProjectHttp } from './ProjectHttp';
import { proxydi } from '@deip/proxydi';
import { MultFormDataMsg, JsonDataMsg } from '@deip/message-models';
import { APP_PROPOSAL } from '@deip/constants'
import {
  CreateProjectCmd,
  UpdateProjectCmd,
  DeleteProjectCmd,
  CreateProposalCmd,
  CreateDaoCmd,
  AddDaoMemberCmd,
  AcceptProposalCmd,
  RemoveDaoMemberCmd
} from '@deip/command-models';
import { ChainService } from '@deip/chain-service';
import { TeamService } from '@deip/team-service';
import { createInstanceGetter, genSha256Hash } from '@deip/toolbox';


// TODO: move to constants
const proposalDefaultLifetime = new Date(new Date().getTime() + 86400000 * 365 * 3).getTime();

export class ProjectService {
  projectHttp = ProjectHttp.getInstance();
  proxydi = proxydi;
  teamService = TeamService.getInstance();

  async getProject(projectId) {
    return this.projectHttp.getProject(projectId);
  }

  async getProjects(projectsIds) {
    return this.projectHttp.getProjects(projectsIds);
  }

  async getTeamDefaultProject(teamId) {
    return this.projectHttp.getTeamDefaultProject(teamId);
  }

  async createProject({ privKey }, {
    isAdmin,
    teamId,
    creator,
    domains,
    isPrivate,
    members,
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
    const { TENANT, CORE_ASSET } = env;
    const isNewProjectTeam = teamId === null;

    return Promise.all([
      ChainService.getInstanceAsync(env),
      isNewProjectTeam ? Promise.resolve({}) : this.teamService.getTeam(teamId),
    ])
      .then(([chainService, team]) => {

        const teamMembers = [];
        const list = team.members ? team.members.map((m) => m.username) : [];
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

              const createDaoCmd = new CreateDaoCmd({
                isTeamAccount: true,
                fee: { ...CORE_ASSET, amount: 0 },
                creator: creator,
                authority: {
                  owner: authoritySetup
                },
                description: genSha256Hash(JSON.stringify({})),
                attributes: []
              });

              txBuilder.addCmd(createDaoCmd);
              teamId = createDaoCmd.getProtocolEntityId();
            }

            const createProjectCmd = new CreateProjectCmd({
              teamId: teamId,
              description: genSha256Hash(JSON.stringify(attributes)),
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
                const updateProposalCmd = new AcceptProposalCmd({
                  entityId: projectProposalId,
                  account: creator
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


  async updateProject({ privKey }, {
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
      this.teamService.getTeam(teamId)
    ])
      .then(([chainService, team]) => {
        const teamMembers = [];
        const list = team.members ? team.members.map((m) => m.username) : [];
        teamMembers.push(...list);

        const chainNodeClient = chainService.getChainNodeClient();
        const chainTxBuilder = chainService.getChainTxBuilder();

        return chainTxBuilder.begin()
          .then((txBuilder) => {

            const joinedMembers = members ? members.filter(member => !teamMembers.includes(member)) : [];
            const leftMembers = members ? teamMembers.filter(member => !members.includes(member) && member != TENANT) : [];

            const invites = joinedMembers.map((invitee) => {
              const addTeamMemberCmd = new AddDaoMemberCmd({
                member: invitee,
                teamId: teamId,
                projectId: projectId,
                isThresholdPreserved: true
              });

              return addTeamMemberCmd;
            });

            const leavings = leftMembers.map((leaving) => {
              const removeDaoMemberCmd = new RemoveDaoMemberCmd({
                member: leaving,
                teamId: teamId,
                projectId: projectId,
                isThresholdPreserved: true
              });

              return removeDaoMemberCmd;
            });


            const updateProjectCmd = new UpdateProjectCmd({
              entityId: projectId,
              teamId: teamId,
              description: genSha256Hash(JSON.stringify(attributes)),
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
                const updateProposalCmd = new AcceptProposalCmd({
                  entityId: projectUpdateProposalId,
                  account: updater
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


  async deleteProject(projectId) {
    const deleteProjectCmd = new DeleteProjectCmd({ entityId: projectId });
    const msg = new JsonDataMsg({ appCmds: [deleteProjectCmd] }, { 'entity-id': projectId });
    return this.projectHttp.deleteProject(msg);
  }

  // Change all methods to cmd

  async getPublicProjectListing({
    searchTerm,
    domains,
    organizations,
    projectAttributes,
    portalIds
  }) {

    const filter = {
      searchTerm: searchTerm || "",
      domains: domains || [],
      organizations: organizations || [],
      projectAttributes: projectAttributes || [],
      portalIds: portalIds || []
    };

    return this.projectHttp.getPublicProjectListing(filter);
  }

  async getUserProjectListing(username) {
    return this.projectHttp.getUserProjectListing(username);
  }

  async getUserPublicProjects(username) {
    return this.projectHttp.getUserProjectListing(username)
      .then((projects) => projects.filter((p) => !p.is_private));
  }

  async getUserPrivateProjects(username) {
    return this.projectHttp.getUserProjectListing(username)
      .then((projects) => projects.filter((p) => p.is_private));
  }

  async getUserTeamsProjects(username) {
    return this.projectHttp.getUserProjectListing(username);
  }

  getUserPersonalProjects(username) {
    return this.projectHttp.getUserProjectListing(username)
      .then((projects) => projects.filter((p) => p.is_personal));
  }

  async getTeamProjectListing(teamId) {
    return this.projectHttp.getTeamProjectListing(teamId);
  }

  async getPortalProjectListing() {
    return this.projectHttp.getPortalProjectListing();
  }

  /** @type {() => ProjectService} */
  static getInstance = createInstanceGetter(ProjectService);
}
