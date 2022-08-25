import {
  createFormData,
  replaceFileWithName,
  genSha256Hash,
  makeSingletonInstance,
  isBoolean
} from '@casimir/toolbox';
import { UserService } from '@casimir/user-service';
import { proxydi } from '@casimir/proxydi';
import { MultFormDataMsg, JsonDataMsg } from '@casimir/messages';
import { APP_EVENT, APP_PROPOSAL } from '@casimir/platform-core';
import {
  CreateProposalCmd,
  CreateDaoCmd,
  AcceptProposalCmd,
  UpdateDaoCmd,
  AddDaoMemberCmd,
  RemoveDaoMemberCmd,
  TransferFTCmd
} from '@casimir/commands';
import { ChainService } from '@casimir/chain-service';
import { WebSocketService } from '@casimir/web-socket-service';
import { walletSignTx } from '@casimir/platform-util';

import { TeamHttp } from './TeamHttp';

const proposalDefaultLifetime = new Date(new Date().getTime() + 86400000 * 365 * 3).getTime();

/**
 * Add proposal commands for adding members
 * @param {BaseTxBuilder} txBuilder
 * @param {string} batchWeight
 * @param {Array} proposalBatch
 * @param {string} creator
 * @returns {BaseTxBuilder}
 */
const addProposalCommandsForAddingMembers = async (
  txBuilder,
  batchWeight,
  proposalBatch,
  creator
) => {
  const createProposalCmd = new CreateProposalCmd({
    creator,
    type: APP_PROPOSAL.ADD_DAO_MEMBER_PROPOSAL,
    expirationTime: proposalDefaultLifetime,
    proposedCmds: proposalBatch,
    batchWeight
  });

  txBuilder.addCmd(createProposalCmd);

  const joinTeamProposalId = createProposalCmd.getProtocolEntityId();
  const updateProposalCmd = new AcceptProposalCmd({
    entityId: joinTeamProposalId,
    account: creator,
    batchWeight
  });

  txBuilder.addCmd(updateProposalCmd);
  return txBuilder;
};

/**
 * Pack transaction for creation
 * @param {BaseTxBuilder} chainTxBuilder
 * @param {string} creator
 * @param {Object} data
 * @param {CreateDaoCmd} createDaoCmd
 * @param {TransferFTCmd} transferFTCmd
 * @param {string} entityId
 * @returns {FinalizedTx}
 */
const packTxForCreation = async (
  chainTxBuilder,
  creator,
  data,
  createDaoCmd,
  transferFTCmd,
  entityId
) => {
  const txBuilder = await chainTxBuilder.begin();

  txBuilder.addCmd(createDaoCmd);

  if (transferFTCmd) {
    txBuilder.addCmd(transferFTCmd);
  }

  let updatedTxBuilder;

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
    const batchWeight = await chainTxBuilder.getBatchWeight(proposalBatch);
    updatedTxBuilder = await addProposalCommandsForAddingMembers(
      txBuilder,
      batchWeight,
      proposalBatch,
      creator
    );
  }
  return updatedTxBuilder ? updatedTxBuilder.end() : txBuilder.end();
};

/**
 * Add proposal commands for team update
 * @param {BaseTxBuilder} txBuilder
 * @param {string} batchWeight
 * @param {Array} proposalBatch
 * @param {string} creator
 * @param {number} proposalLifetime
 * @param {boolean} isProposalApproved
 * @returns {BaseTxBuilder}
 */
const addProposalCommandsForTeamUpdate = async (
  txBuilder,
  batchWeight,
  proposalBatch,
  creator,
  proposalLifetime,
  isProposalApproved
) => {
  const createProposalCmd = new CreateProposalCmd({
    creator,
    type: APP_PROPOSAL.TEAM_UPDATE_PROPOSAL,
    expirationTime: proposalLifetime,
    proposedCmds: proposalBatch,
    batchWeight
  });

  txBuilder.addCmd(createProposalCmd);

  if (isProposalApproved) {
    const teamUpdateProposalId = createProposalCmd.getProtocolEntityId();
    const updateProposalCmd = new AcceptProposalCmd({
      entityId: teamUpdateProposalId,
      account: creator,
      batchWeight
    });

    txBuilder.addCmd(updateProposalCmd);
  }
  return txBuilder;
};

/**
 * Pack transaction for team update
 * @param {BaseTxBuilder} chainTxBuilder
 * @param {Array} attributes
 * @param {string} description
 * @param {string} entityId
 * @param {boolean} isProposal
 * @param {string} creator
 * @param {number} proposalLifetime
 * @param {boolean} isProposalApproved
 * @returns {FinalizedTx}
 */
const packTxForUpdate = async (
  chainTxBuilder,
  attributes,
  description,
  entityId,
  isProposal,
  creator,
  proposalLifetime,
  isProposalApproved
) => {
  const txBuilder = await chainTxBuilder.begin();

  const updateDaoCmd = new UpdateDaoCmd({
    entityId,
    isTeamAccount: true,
    attributes, // need clarification
    description
  });

  let updatedTxBuilder;

  if (isProposal) {
    const proposalBatch = [
      updateDaoCmd
    ];

    const batchWeight = await chainTxBuilder.getBatchWeight(proposalBatch);

    updatedTxBuilder = await addProposalCommandsForTeamUpdate(
      txBuilder,
      batchWeight,
      proposalBatch,
      creator,
      proposalLifetime,
      isProposalApproved
    );
  }
  txBuilder.addCmd(updateDaoCmd);
  return (updatedTxBuilder) ? updatedTxBuilder.end() : txBuilder.end();
};
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
  async create(payload) {
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

    const chainService = await ChainService.getInstanceAsync(env);

    const chainNodeClient = chainService.getChainNodeClient();
    const chainTxBuilder = chainService.getChainTxBuilder();

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

    const entityId = createDaoCmd.getProtocolEntityId();
    let transferFTCmd;

    if (ACCOUNT_DEFAULT_FUNDING_AMOUNT) {
      transferFTCmd = new TransferFTCmd({
        from: creator,
        to: entityId,
        tokenId: CORE_ASSET.id,
        amount: ACCOUNT_DEFAULT_FUNDING_AMOUNT
      });
    }

    const packedTx = await packTxForCreation(
      chainTxBuilder,
      creator,
      data,
      createDaoCmd,
      transferFTCmd,
      entityId
    );

    const chainInfo = chainService.getChainInfo();
    let signedTx;

    if (env.WALLET_URL) {
      signedTx = await walletSignTx(packedTx, chainInfo);
    } else {
      signedTx = await packedTx.signAsync(privKey, chainNodeClient);
    }

    const msg = new MultFormDataMsg(formData, signedTx.getPayload(), { 'entity-id': entityId });
    if (RETURN_MSG && RETURN_MSG === true) {
      return msg;
    }

    const response = await this.teamHttp.create(msg);

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

    const chainService = await ChainService.getInstanceAsync(env);

    const chainNodeClient = chainService.getChainNodeClient();
    const chainTxBuilder = chainService.getChainTxBuilder();

    const packedTx = await packTxForUpdate(
      chainTxBuilder,
      attributes,
      description,
      entityId,
      isProposal,
      creator,
      proposalLifetime,
      isProposalApproved
    );

    const chainInfo = chainService.getChainInfo();
    let signedTx;

    if (env.WALLET_URL) {
      signedTx = await walletSignTx(packedTx, chainInfo);
    } else {
      signedTx = await packedTx.signAsync(privKey, chainNodeClient);
    }

    // eslint-disable-next-line max-len
    const msg = new MultFormDataMsg(formData, signedTx.getPayload(), { 'entity-id': entityId });

    if (env.RETURN_MSG === true) {
      return msg;
    }

    const response = await this.teamHttp.update(msg);

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

    const chainService = await ChainService.getInstanceAsync(env);

    const chainNodeClient = chainService.getChainNodeClient();
    const chainTxBuilder = chainService.getChainTxBuilder();
    const txBuilder = await chainTxBuilder.begin();

    const addTeamMemberCmd = new AddDaoMemberCmd({
      member,
      teamId,
      isThresholdPreserved: isBoolean(isThresholdPreserved) ? isThresholdPreserved : true
    });

    const proposalBatch = [
      addTeamMemberCmd
    ];

    const batchWeight = await chainTxBuilder.getBatchWeight(proposalBatch);
    const createProposalCmd = new CreateProposalCmd({
      creator,
      type: APP_PROPOSAL.ADD_DAO_MEMBER_PROPOSAL,
      expirationTime: proposalDefaultLifetime,
      proposedCmds: proposalBatch,
      batchWeight
    });
    txBuilder.addCmd(createProposalCmd);

    const joinTeamProposalId = createProposalCmd.getProtocolEntityId();
    const updateProposalCmd = new AcceptProposalCmd({
      entityId: joinTeamProposalId,
      account: creator,
      batchWeight
    });
    txBuilder.addCmd(updateProposalCmd);

    const packedTx = await txBuilder.end();

    const chainInfo = chainService.getChainInfo();
    let signedTx;

    if (env.WALLET_URL) {
      signedTx = await walletSignTx(packedTx, chainInfo);
    } else {
      signedTx = await packedTx.signAsync(privKey, chainNodeClient);
    }

    const msg = new JsonDataMsg(signedTx.getPayload(), { 'entity-id': teamId });

    if (env.RETURN_MSG === true) {
      return msg;
    }

    return this.teamHttp.addTeamMember(msg);
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

    const chainService = await ChainService.getInstanceAsync(env);

    const chainNodeClient = chainService.getChainNodeClient();
    const chainTxBuilder = chainService.getChainTxBuilder();
    const txBuilder = await chainTxBuilder.begin();

    const removeDaoMemberCmd = new RemoveDaoMemberCmd({
      member,
      teamId,
      isThresholdPreserved: isBoolean(isThresholdPreserved) ? isThresholdPreserved : true
    });

    const proposalBatch = [
      removeDaoMemberCmd
    ];

    const batchWeight = await chainTxBuilder.getBatchWeight(proposalBatch);
    const createProposalCmd = new CreateProposalCmd({
      creator,
      type: APP_PROPOSAL.REMOVE_DAO_MEMBER_PROPOSAL,
      expirationTime: proposalDefaultLifetime,
      proposedCmds: proposalBatch,
      batchWeight
    });

    txBuilder.addCmd(createProposalCmd);

    const leaveTeamProposalId = createProposalCmd.getProtocolEntityId();
    const updateProposalCmd = new AcceptProposalCmd({
      entityId: leaveTeamProposalId,
      account: creator,
      batchWeight
    });

    txBuilder.addCmd(updateProposalCmd);

    const packedTx = await txBuilder.end();

    const chainInfo = chainService.getChainInfo();
    let signedTx;

    if (env.WALLET_URL) {
      signedTx = await walletSignTx(packedTx, chainInfo);
    } else {
      signedTx = await packedTx.signAsync(privKey, chainNodeClient);
    }

    const msg = new JsonDataMsg(signedTx.getPayload(), { 'entity-id': teamId });

    if (env.RETURN_MSG === true) {
      return msg;
    }

    return this.teamHttp.removeTeamMember(msg);
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
