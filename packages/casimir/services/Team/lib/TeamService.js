import {
  createFormData,
  replaceFileWithName,
  genSha256Hash,
  makeSingletonInstance,
  isBoolean
} from '@deip/toolbox';
import { UserService } from '@deip/user-service';
import { proxydi } from '@deip/proxydi';
import { MultFormDataMsg, JsonDataMsg } from '@deip/messages';
import { APP_EVENT, APP_PROPOSAL } from '@deip/constants';
import {
  CreateProposalCmd,
  CreateDaoCmd,
  AcceptProposalCmd,
  UpdateDaoCmd,
  CreateProjectCmd,
  AddDaoMemberCmd,
  RemoveDaoMemberCmd,
  TransferFungibleTokenCmd
} from '@deip/commands';
import { ChainService } from '@deip/chain-service';
import { WebSocketService } from '@deip/web-socket-service';

import { TeamHttp } from './TeamHttp';

const proposalDefaultLifetime = new Date(new Date().getTime() + 86400000 * 365 * 3).getTime();

export class TeamService {
  proxydi = proxydi;
  teamHttp = TeamHttp.getInstance();
  userService = UserService.getInstance();
  webSocketService = WebSocketService.getInstance();

  /**
   * Create new team
   * @param {Object} payload
   * @param {Object} payload.initiator
   * @param {string} payload.initiator.privKey
   * @param {string} payload.initiator.username
   * @param {Object[]} payload.attributes
   * @param {string[]} payload.members
   * @param {boolean} isCreateDefaultProject
   * @return {Promise<Object>}
   */
  async create(payload, isCreateDefaultProject = false) {
    const env = this.proxydi.get('env');
    const {
      TENANT, CORE_ASSET, ACCOUNT_DEFAULT_FUNDING_AMOUNT, RETURN_MSG
    } = env;
    const {
      initiator: {
        privKey,
        username: creator
      },
      ...data
    } = payload;

    const authority = {
      auths: [{ name: TENANT, weight: 1 }, { name: creator, weight: 1 }],
      weight: 1
    };

    const formData = createFormData(data);

    const attributes = replaceFileWithName(data.attributes);
    const description = genSha256Hash(attributes);

    const response = await ChainService.getInstanceAsync(env)
      .then((chainService) => {
        let entityId;
        const chainNodeClient = chainService.getChainNodeClient();
        const chainTxBuilder = chainService.getChainTxBuilder();
        return chainTxBuilder.begin()
          .then((txBuilder) => {
            const createDaoCmd = new CreateDaoCmd({
              isTeamAccount: true,
              fee: { ...CORE_ASSET, amount: 0 },
              authority: {
                owner: authority
              },
              creator,
              description,
              attributes
            });

            txBuilder.addCmd(createDaoCmd);
            entityId = createDaoCmd.getProtocolEntityId();

            if (ACCOUNT_DEFAULT_FUNDING_AMOUNT) {
              const transferFungibleTokenCmd = new TransferFungibleTokenCmd({
                from: creator,
                to: entityId,
                tokenId: CORE_ASSET.id,
                amount: ACCOUNT_DEFAULT_FUNDING_AMOUNT
              });
              txBuilder.addCmd(transferFungibleTokenCmd);
            }

            if (isCreateDefaultProject) {
              const createProjectCmd = new CreateProjectCmd({
                teamId: entityId,
                description: genSha256Hash([]),
                domains: [],
                isDefault: true,
                attributes: []
              });
              txBuilder.addCmd(createProjectCmd);
            }

            const members = data.members.filter((m) => m !== creator);
            if (members.length > 0) {
              const invites = members.map((invitee) => {
                const addTeamMemberCmd = new AddDaoMemberCmd({
                  member: invitee,
                  teamId: entityId,
                  isThresholdPreserved: true
                });

                return addTeamMemberCmd;
              });

              const proposalBatch = [
                ...invites
              ];

              return chainTxBuilder.getBatchWeight(proposalBatch)
                .then((proposalBatchWeight) => {
                  const createProposalCmd = new CreateProposalCmd({
                    creator,
                    type: APP_PROPOSAL.ADD_DAO_MEMBER_PROPOSAL,
                    expirationTime: proposalDefaultLifetime,
                    proposedCmds: proposalBatch
                  });

                  txBuilder.addCmd(createProposalCmd);

                  const joinTeamProposalId = createProposalCmd.getProtocolEntityId();
                  const updateProposalCmd = new AcceptProposalCmd({
                    entityId: joinTeamProposalId,
                    account: creator,
                    batchWeight: proposalBatchWeight
                  });

                  txBuilder.addCmd(updateProposalCmd);
                  return txBuilder.end();
                });
            }
            return txBuilder.end();
          })
          .then((packedTx) => packedTx.signAsync(privKey, chainNodeClient))
          .then((packedTx) => {
            // eslint-disable-next-line max-len
            const msg = new MultFormDataMsg(formData, packedTx.getPayload(), { 'entity-id': entityId });
            if (RETURN_MSG && RETURN_MSG === true) {
              return msg;
            }
            return this.teamHttp.create(msg);
          });
      });

    await this.webSocketService.waitForMessage((message) => {
      const [, eventBody] = message;
      return eventBody.event.eventNum === APP_EVENT.DAO_CREATED
                  && eventBody.event.eventPayload.daoId === response.data._id;
    });

    return response;
  }

  /**
   * Update team
   * @param {Object} payload
   * @param {Object} payload.initiator
   * @param {string} payload.initiator.privKey
   * @param {string} payload.initiator.username
   * @param {string} payload.entityId
   * @param {Object} payload.proposalInfo
   * @param {Object[]} payload.attributes
   * @return {Promise<Object>}
   */
  async update(payload) {
    const env = this.proxydi.get('env');
    const {
      initiator: {
        privKey,
        username: creator
      },
      ...data
    } = payload;

    const {
      entityId,
      proposalInfo: {
        isProposal = false,
        isProposalApproved = true,
        proposalLifetime = proposalDefaultLifetime
      } = {}
    } = data;

    const formData = createFormData(data);

    const attributes = replaceFileWithName(data.attributes);
    const description = genSha256Hash(attributes);

    const response = await ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const chainNodeClient = chainService.getChainNodeClient();
        const chainTxBuilder = chainService.getChainTxBuilder();
        return chainTxBuilder.begin()
          .then((txBuilder) => {
            const updateDaoCmd = new UpdateDaoCmd({
              entityId,
              isTeamAccount: true,
              attributes, // need clarification
              description
            });

            if (isProposal) {
              const proposalBatch = [
                updateDaoCmd
              ];

              return chainTxBuilder.getBatchWeight(proposalBatch)
                .then((proposalBatchWeight) => {
                  const createProposalCmd = new CreateProposalCmd({
                    creator,
                    type: APP_PROPOSAL.TEAM_UPDATE_PROPOSAL,
                    expirationTime: proposalLifetime,
                    proposedCmds: proposalBatch
                  });

                  txBuilder.addCmd(createProposalCmd);

                  if (isProposalApproved) {
                    const teamUpdateProposalId = createProposalCmd.getProtocolEntityId();
                    const updateProposalCmd = new AcceptProposalCmd({
                      entityId: teamUpdateProposalId,
                      account: creator,
                      batchWeight: proposalBatchWeight
                    });

                    txBuilder.addCmd(updateProposalCmd);
                  }
                  return txBuilder.end();
                });
            }
            txBuilder.addCmd(updateDaoCmd);
            return txBuilder.end();
          })
          .then((packedTx) => packedTx.signAsync(privKey, chainNodeClient))
          .then((packedTx) => {
            // eslint-disable-next-line max-len
            const msg = new MultFormDataMsg(formData, packedTx.getPayload(), { 'entity-id': entityId });

            if (env.RETURN_MSG === true) {
              return msg;
            }

            return this.teamHttp.update(msg);
          });
      });

    await this.webSocketService.waitForMessage((message) => {
      const [, eventBody] = message;

      return eventBody.event.eventNum === APP_EVENT.DAO_UPDATED
                    && eventBody.event.eventPayload.daoId === response.data._id;
    });

    return response;
  }

  /**
   * Add member to team
   * @param {Object} payload
   * @param {Object} payload.initiator
   * @param {string} payload.initiator.privKey
   * @param {string} payload.initiator.username
   * @param {string} payload.teamId
   * @param {string} payload.member - Member id
   * @param {boolean} payload.isThresholdPreserved
   * @return {Promise<Object>}
   */
  async addTeamMember(payload) {
    const env = this.proxydi.get('env');
    const {
      initiator: {
        privKey,
        username: creator
      },
      teamId,
      member,
      isThresholdPreserved
    } = payload;

    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const chainNodeClient = chainService.getChainNodeClient();
        const chainTxBuilder = chainService.getChainTxBuilder();
        return chainTxBuilder.begin()
          .then((txBuilder) => {
            const addTeamMemberCmd = new AddDaoMemberCmd({
              member,
              teamId,
              isThresholdPreserved: isBoolean(isThresholdPreserved) ? isThresholdPreserved : true
            });

            const proposalBatch = [
              addTeamMemberCmd
            ];

            return chainTxBuilder.getBatchWeight(proposalBatch)
              .then((proposalBatchWeight) => {
                const createProposalCmd = new CreateProposalCmd({
                  creator,
                  type: APP_PROPOSAL.ADD_DAO_MEMBER_PROPOSAL,
                  expirationTime: proposalDefaultLifetime,
                  proposedCmds: proposalBatch
                });
                txBuilder.addCmd(createProposalCmd);

                const joinTeamProposalId = createProposalCmd.getProtocolEntityId();
                const updateProposalCmd = new AcceptProposalCmd({
                  entityId: joinTeamProposalId,
                  account: creator,
                  batchWeight: proposalBatchWeight
                });
                txBuilder.addCmd(updateProposalCmd);

                return txBuilder.end();
              });
          })
          .then((packedTx) => packedTx.signAsync(privKey, chainNodeClient))
          .then((packedTx) => {
            const msg = new JsonDataMsg(packedTx.getPayload(), { 'entity-id': teamId });

            if (env.RETURN_MSG === true) {
              return msg;
            }

            return this.teamHttp.addTeamMember(msg);
          });
      });
  }

  /**
   * Remove member from team
   * @param {Object} payload
   * @param {Object} payload.initiator
   * @param {string} payload.initiator.privKey
   * @param {string} payload.initiator.username
   * @param {string} payload.teamId
   * @param {string} payload.member - Member id
   * @param {boolean} payload.isThresholdPreserved
   * @return {Promise<Object>}
   */
  async removeTeamMember(payload) {
    const env = this.proxydi.get('env');
    const {
      initiator: {
        privKey,
        username: creator
      },
      teamId,
      member,
      isThresholdPreserved
    } = payload;

    return ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const chainNodeClient = chainService.getChainNodeClient();
        const chainTxBuilder = chainService.getChainTxBuilder();
        return chainTxBuilder.begin()
          .then((txBuilder) => {
            const removeDaoMemberCmd = new RemoveDaoMemberCmd({
              member,
              teamId,
              isThresholdPreserved: isBoolean(isThresholdPreserved) ? isThresholdPreserved : true
            });

            const proposalBatch = [
              removeDaoMemberCmd
            ];

            return chainTxBuilder.getBatchWeight(proposalBatch)
              .then((proposalBatchWeight) => {
                const createProposalCmd = new CreateProposalCmd({
                  creator,
                  type: APP_PROPOSAL.REMOVE_DAO_MEMBER_PROPOSAL,
                  expirationTime: proposalDefaultLifetime,
                  proposedCmds: proposalBatch
                });

                txBuilder.addCmd(createProposalCmd);

                const leaveTeamProposalId = createProposalCmd.getProtocolEntityId();
                const updateProposalCmd = new AcceptProposalCmd({
                  entityId: leaveTeamProposalId,
                  account: creator,
                  batchWeight: proposalBatchWeight
                });

                txBuilder.addCmd(updateProposalCmd);

                return txBuilder.end();
              });
          })
          .then((packedTx) => packedTx.signAsync(privKey, chainNodeClient))
          .then((packedTx) => {
            const msg = new JsonDataMsg(packedTx.getPayload(), { 'entity-id': teamId });

            if (env.RETURN_MSG === true) {
              return msg;
            }

            return this.teamHttp.removeTeamMember(msg);
          });
      });
  }

  /**
   * Get team by team id
   * @param {string} teamId
   * @return {Promise<Object>}
   */
  async getOne(teamId) {
    const [teamResponse, membersResponse] = await Promise.all([
      this.teamHttp.getOne(teamId),
      this.userService.getListByTeam(teamId)
    ]);

    return {
      ...teamResponse,
      data: {
        ...teamResponse.data,
        members: membersResponse.data.items
      }
    };
  }

  /**
   * Get teams by ids
   * @param {string[]} ids - Team ids
   * @return {Promise<Object>}
   */
  async getListByIds(ids) {
    return this.teamHttp.getListByIds(ids);
  }

  /**
   * Get list of teams
   * @param {boolean} withPortalTeam
   * @return {Promise<Object>}
   */
  async getList(withPortalTeam = false) {
    return this.teamHttp.getList(withPortalTeam);
  }

  /**
   * Get list of teams  by username
   * @param {string} user
   * @param {boolean} withPortalTeam
   * @return {Promise<Object>}
   */
  async getListByUser(user, withPortalTeam = false) {
    return this.teamHttp.getListByUser(user, withPortalTeam);
  }

  /**
   * Get list of teams by portal id
   * @param {string} portalId
   * @param {boolean} withPortalTeam
   * @return {Promise<Object>}
   */
  async getListByPortal(portalId, withPortalTeam = false) {
    return this.teamHttp.getListByPortal(portalId, withPortalTeam);
  }

  /** @type {() => TeamService} */
  static getInstance = makeSingletonInstance(() => new TeamService());
}
