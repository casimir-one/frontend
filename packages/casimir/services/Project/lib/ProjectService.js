import { proxydi } from '@deip/proxydi';
import { MultFormDataMsg, JsonDataMsg } from '@deip/messages';
import { APP_PROPOSAL } from '@deip/constants';
import {
  CreateProjectCmd,
  UpdateProjectCmd,
  DeleteProjectCmd,
  CreateProposalCmd,
  CreateDaoCmd,
  AddDaoMemberCmd,
  AcceptProposalCmd,
  RemoveDaoMemberCmd
} from '@deip/commands';
import { ChainService } from '@deip/chain-service';
import { TeamService } from '@deip/team-service';
import {
  createFormData, createInstanceGetter, genSha256Hash, replaceFileWithName
} from '@deip/toolbox';
import { ProjectHttp } from './ProjectHttp';

// TODO: move to constants
const proposalDefaultLifetime = new Date(new Date().getTime() + 86400000 * 365 * 3).getTime();

/**
  * @typedef {{isProposal: boolean,
  *  isProposalApproved: boolean,
  *  proposalLifetime: number}} ProposalInfo
 */

/**
  * @typedef {{privKey: string, username: string}} Initiator
*/

/**
 * Projects data transport
 */
export class ProjectService {
  projectHttp = ProjectHttp.getInstance();
  proxydi = proxydi;
  teamService = TeamService.getInstance();

  /**
   * Extract FormData from data
   * @param {Object} data
   * @returns {Object} convertedData
   * @returns {FormData} convertedData.formData
   * @returns {Array} convertedData.attributes
   * @returns {string} convertedData.description
   */
  static #convertFormData(data) {
    const formData = createFormData(data);
    const attributes = replaceFileWithName(data.attributes);
    const description = genSha256Hash(attributes);

    return {
      formData,
      attributes,
      description
    };
  }

  /**
   * Parse proposalInfo and set default values
   * @param {ProposalInfo} proposalInfo
   * @returns {ProposalInfo} result
   */
  static #convertProposalInfo(proposalInfo) {
    return {
      isProposal: false,
      isProposalApproved: true,
      proposalLifetime: proposalDefaultLifetime,
      ...proposalInfo
    };
  }

  /**
   * Get project by id
   * @param {string} projectId
   * @returns {Promise<Object>}
   */
  async getOne(projectId) {
    return this.projectHttp.getOne(projectId);
  }

  /**
   * Get project list by ids
   * @param {Array.<string>} ids
   * @returns {Promise<Object>}
   */
  async getListByIds(ids) {
    return this.projectHttp.getListByIds(ids);
  }

  /**
   * Get team default project
   * @param {string} teamId
   * @returns {Promise<Object>}
   */
  async getTeamDefaultProject(teamId) {
    return this.projectHttp.getTeamDefaultProject(teamId);
  }

  /**
   * Create project
   * @param {Object} payload
   * @param {Initiator} payload.initiator
   * @param {Object} payload.data
   * @param {string} payload.data.teamId
   * @param {Array.<string>} payload.data.members
   * @param {Array.<string>} payload.data.domains
   * @param {Array.<Object>} payload.data.attributes
   * @param {boolean} payload.data.isPrivate
   * @param {boolean} payload.data.isAdmin
   * @param {ProposalInfo} payload.proposalInfo
   * @returns {Promise<Object>}
   */
  async create(payload) {
    const env = this.proxydi.get('env');
    const { TENANT, CORE_ASSET } = env;

    const {
      initiator: { privKey, username: creator },
      data,
      proposalInfo
    } = payload;

    const {
      teamId = null,
      members = [],
      isPrivate = false,
      isAdmin = false,
      domains = []
    } = data;

    const {
      isProposal,
      isProposalApproved,
      proposalLifetime
    } = ProjectService.#convertProposalInfo(proposalInfo);

    const {
      formData,
      attributes,
      description
    } = ProjectService.#convertFormData(data);

    const needProjectTeam = teamId === null;

    return Promise.all([
      ChainService.getInstanceAsync(env),
      needProjectTeam ? Promise.resolve({ data: {} }) : this.teamService.getOne(teamId)
    ])
      .then(([chainService, teamResponse]) => {
        const team = teamResponse?.data;

        const teamMembers = [];
        const list = team.members ? team.members.map((m) => m.username) : [];
        teamMembers.push(...list);

        const chainNodeClient = chainService.getChainNodeClient();
        const chainTxBuilder = chainService.getChainTxBuilder();

        let projectId;

        return chainTxBuilder.begin()
          .then((txBuilder) => {
            let projectTeamId = teamId;

            if (needProjectTeam) {
              const authoritySetup = {
                auths: [],
                weight: 1
              };

              if (isAdmin) {
                authoritySetup.auths.push({ name: TENANT, weight: 1 });
              }

              const projectTeamMembers = members
                .filter((member) => !teamMembers.some((m) => m === member))
                .reduce((acc, member) => (
                  acc.some((m) => m === member)
                    ? acc
                    : [...acc, member]),
                [])
                .map((member) => ({ name: member, weight: 1 }));

              authoritySetup.auths.push(...projectTeamMembers);

              const createDaoCmd = new CreateDaoCmd({
                isTeamAccount: true,
                fee: { ...CORE_ASSET, amount: 0 },
                creator,
                authority: { owner: authoritySetup },
                description: genSha256Hash(JSON.stringify({})),
                attributes: []
              });

              txBuilder.addCmd(createDaoCmd);
              projectTeamId = createDaoCmd.getProtocolEntityId();
            }

            const createProjectCmd = new CreateProjectCmd({
              teamId: projectTeamId,
              description,
              domains,
              isPrivate,
              isDefault: false,
              members: undefined, // ???
              attributes
            });

            projectId = createProjectCmd.getProtocolEntityId();

            if (isProposal) {
              const proposalBatch = [
                createProjectCmd
              ];

              return chainTxBuilder.getBatchWeight(proposalBatch)
                .then((proposalBatchWeight) => {
                  const createProposalCmd = new CreateProposalCmd({
                    type: APP_PROPOSAL.PROJECT_PROPOSAL,
                    creator,
                    expirationTime: proposalLifetime || proposalDefaultLifetime,
                    proposedCmds: proposalBatch
                  });
                  txBuilder.addCmd(createProposalCmd);

                  if (isProposalApproved) {
                    const projectProposalId = createProposalCmd.getProtocolEntityId();
                    const updateProposalCmd = new AcceptProposalCmd({
                      entityId: projectProposalId,
                      account: teamId,
                      batchWeight: proposalBatchWeight
                    });
                    txBuilder.addCmd(updateProposalCmd);
                  }

                  return txBuilder.end();
                });
            }
            txBuilder.addCmd(createProjectCmd);
            return txBuilder.end();
          })
          .then((packedTx) => packedTx.signAsync(privKey, chainNodeClient))
          .then((packedTx) => {
            const msg = new MultFormDataMsg(formData, packedTx.getPayload(), { 'entity-id': projectId });
            return this.projectHttp.create(msg);
          });
      });
  }

  /**
   * Update project
   * @param {Object} payload
   * @param {Initiator} payload.initiator
   * @param {Object} payload.data
   * @param {string} payload.data._id
   * @param {string} payload.data.teamId
   * @param {Array.<string>} payload.data.members
   * @param {Array.<Object>} payload.data.attributes
   * @param {boolean} payload.data.isPrivate
   * @param {ProposalInfo} payload.proposalInfo
   * @returns {Promise<Object>}
   */
  async update(payload) {
    const env = this.proxydi.get('env');
    const { TENANT } = env;

    const {
      initiator: { privKey, username: updater },
      data,
      proposalInfo
    } = payload;

    const {
      _id,
      teamId = null,
      members = undefined,
      isPrivate = false
    } = data;

    const {
      isProposal,
      isProposalApproved,
      proposalLifetime
    } = ProjectService.#convertProposalInfo(proposalInfo);

    const {
      formData,
      attributes,
      description
    } = ProjectService.#convertFormData(data);

    return Promise.all([
      ChainService.getInstanceAsync(env),
      this.teamService.getOne(teamId)
    ])
      .then(([chainService, teamResponse]) => {
        const team = teamResponse?.data;

        const teamMembers = [];
        const list = team.members ? team.members.map((m) => m.username) : [];
        teamMembers.push(...list);

        const chainNodeClient = chainService.getChainNodeClient();
        const chainTxBuilder = chainService.getChainTxBuilder();

        return chainTxBuilder.begin()
          .then((txBuilder) => {
            const joinedMembers = members
              ? members.filter((member) => !teamMembers.includes(member))
              : [];

            const leftMembers = members
              ? teamMembers.filter((member) => !members.includes(member) && member !== TENANT)
              : [];

            const invites = joinedMembers.map((invitee) => new AddDaoMemberCmd({
              member: invitee,
              teamId,
              projectId: _id,
              isThresholdPreserved: true
            }));

            const leavings = leftMembers.map((leaving) => new RemoveDaoMemberCmd({
              member: leaving,
              teamId,
              projectId: _id,
              isThresholdPreserved: true
            }));

            const updateProjectCmd = new UpdateProjectCmd({
              entityId: _id,
              teamId,
              description,
              isPrivate,
              members: undefined, // ???
              attributes
            });

            if (isProposal) {
              const proposalBatch = [
                updateProjectCmd,
                ...invites,
                ...leavings
              ];

              return chainTxBuilder.getBatchWeight(proposalBatch)
                .then((proposalBatchWeight) => {
                  const createProposalCmd = new CreateProposalCmd({
                    type: APP_PROPOSAL.PROJECT_UPDATE_PROPOSAL,
                    creator: updater,
                    expirationTime: proposalLifetime || proposalDefaultLifetime,
                    proposedCmds: proposalBatch
                  });
                  txBuilder.addCmd(createProposalCmd);

                  if (isProposalApproved) {
                    const projectUpdateProposalId = createProposalCmd.getProtocolEntityId();
                    const updateProposalCmd = new AcceptProposalCmd({
                      entityId: projectUpdateProposalId,
                      account: updater,
                      batchWeight: proposalBatchWeight
                    });
                    txBuilder.addCmd(updateProposalCmd);
                  }

                  return txBuilder.end();
                });
            }
            txBuilder.addCmd(updateProjectCmd);
            for (let i = 0; i < invites.length; i++) {
              txBuilder.addCmd(invites[i]);
            }
            for (let i = 0; i < leavings.length; i++) {
              txBuilder.addCmd(leavings[i]);
            }

            return txBuilder.end();
          })
          .then((packedTx) => packedTx.signAsync(privKey, chainNodeClient))
          .then((packedTx) => {
            const msg = new MultFormDataMsg(formData, packedTx.getPayload(), { 'entity-id': _id });
            return this.projectHttp.update(msg);
          });
      });
  }

  /**
   * Delete project
   * @param {string} projectId
   * @returns {Promise<Object>}
   */
  async delete(projectId) {
    const deleteProjectCmd = new DeleteProjectCmd({ entityId: projectId });
    const msg = new JsonDataMsg({ appCmds: [deleteProjectCmd] }, { 'entity-id': projectId });
    return this.projectHttp.delete(msg);
  }

  // Change all methods to cmd

  /**
   * Get public projects
   * @param {Object} filter
   * @param {string} filter.searchTerm
   * @param {Array.<string>} filter.domains
   * @param {Array.<string>} filter.organizations
   * @param {Array} filter.projectAttributes
   * @param {Array.<string>} filter.projectAttributes
   * @returns {Promise<Object>}
   */
  async getPublicProjectList(filter) {
    const {
      searchTerm = '',
      domains = [],
      organizations = [],
      projectAttributes = [],
      portalIds = []
    } = filter;

    return this.projectHttp.getPublicProjectList({
      searchTerm,
      domains,
      organizations,
      projectAttributes,
      portalIds
    });
  }

  /**
   * Get projects where user is member
   * @param {string} username
   * @returns {Promise<Object>}
   */
  async getUserProjectList(username) {
    return this.projectHttp.getUserProjectList(username);
  }

  /**
   * Get public projects where user is member
   * @param {string} username
   * @returns {Promise<Object>}
   */
  async getUserPublicProjectList(username) {
    return this.projectHttp.getUserProjectList(username)
      .then((projects) => projects.filter((p) => !p.is_private));
  }

  /**
   * Get private projects where user is member
   * @param {string} username
   * @returns {Promise<Object>}
   */
  async getUserPrivateProjectList(username) {
    return this.projectHttp.getUserProjectList(username)
      .then((projects) => projects.filter((p) => p.is_private));
  }

  /**
   * Get projects for team
   * @param {string} teamId
   * @returns {Promise<Object>}
   */
  async getTeamProjectList(teamId) {
    return this.projectHttp.getTeamProjectList(teamId);
  }

  /**
   * Get projects for portal
   * @returns {Promise<Object>}
   */
  async getPortalProjectList() {
    return this.projectHttp.getPortalProjectList();
  }

  /** @type {() => ProjectService} */
  static getInstance = createInstanceGetter(ProjectService);
}
