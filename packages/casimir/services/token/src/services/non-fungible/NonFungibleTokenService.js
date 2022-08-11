import {
  makeSingletonInstance,
  createFormData,
  replaceFileWithName
} from '@casimir/toolbox';
import { proxydi } from '@casimir/proxydi';
import { JsonDataMsg, MultFormDataMsg } from '@casimir/messages';
import {
  TransferNFTCmd,
  TransferFTCmd,
  CreateNftCollectionCmd,
  CreateNftItemCmd,
  CreateNftCollectionMetadataCmd,
  UpdateNftItemMetadataDraftCmd,
  CreateNftItemMetadataDraftCmd,
  DeleteNftItemMetadataDraftCmd,
  CreateNftItemMetadataCmd,
  UpdateNftCollectionMetadataCmd,
  UpdateNftItemMetadataDraftStatusCmd,
  UpdateNftItemMetadataDraftModerationMsgCmd,
  AcceptProposalCmd,
  CreateProposalCmd
} from '@casimir/commands';
import { APP_PROPOSAL, APP_EVENT } from '@casimir/platform-core';
import { walletSignTx } from '@casimir/platform-util';
import { ChainService } from '@casimir/chain-service';
import { WebSocketService } from '@casimir/web-socket-service';
import { NonFungibleTokenHttp } from './NonFungibleTokenHttp';

import { transferToken, updateProposalInfo } from '../../util';

/**
 * Non-fungible token service
 */
export class NonFungibleTokenService {
  proxydi = proxydi;
  webSocketService = WebSocketService.getInstance();

  nonFungibleTokenHttp = NonFungibleTokenHttp.getInstance();

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

    return {
      formData,
      attributes
    };
  }

  /**
   * Create new nft collection and nft collection metadata
   * @param {import('@casimir/platform-core').NonFungibleTokenCreatePayload} payload
   * @param signTxCallback
   * @return {Promise<Object>}
   */
  async createNftCollection(payload) {
    const {
      initiator: { privKey },
      data: {
        issuer,
        issuedByTeam
      }
    } = payload;
    const env = this.proxydi.get('env');

    const chainService = await ChainService.getInstanceAsync(env);
    const chainTxBuilder = chainService.getChainTxBuilder();
    const chainRpc = chainService.getChainRpc();

    const txBuilder = await chainTxBuilder.begin();
    const entityId = await chainRpc.getNextAvailableNftCollectionId();

    const createNftCollectionCmd = new CreateNftCollectionCmd({
      entityId,
      issuer,
      issuedByTeam
    });
    txBuilder.addCmd(createNftCollectionCmd);

    const packedTx = await txBuilder.end();

    const chainNodeClient = chainService.getChainNodeClient();
    const chainInfo = chainService.getChainInfo();
    let signedTx;

    if (env.WALLET_URL) {
      signedTx = await walletSignTx(packedTx, chainInfo);
    } else {
      signedTx = await packedTx.signAsync(privKey, chainNodeClient);
    }

    const collectionMsg = new JsonDataMsg(signedTx.getPayload());

    await this.nonFungibleTokenHttp.create(collectionMsg);

    const {
      formData,
      attributes
    } = NonFungibleTokenService.#convertFormData(payload.data);

    const createNftCollectionMetadataCmd = new CreateNftCollectionMetadataCmd({
      entityId,
      issuer,
      issuedByTeam,
      attributes
    });
    const metadataMsg = new MultFormDataMsg(
      formData,
      { appCmds: [createNftCollectionMetadataCmd] },
      { 'entity-id': entityId }
    );

    const response = await this.nonFungibleTokenHttp.createNftCollectionMetadata(metadataMsg);

    await this.webSocketService.waitForMessage((message) => {
      const [, eventBody] = message;
      return eventBody.event.eventNum === APP_EVENT.NFT_COLLECTION_METADATA_CREATED
        && eventBody.event.eventPayload.entityId === response.data._id;
    }, 20000);

    return response;
  }

  /**
   * Update nft collection metadata
   * @param {Object} payload.data
   * @param {string} payload.data._id
   * @param {Array.<Object>} payload.data.attributes
   * @returns {Promise<Object>}
   */
  async updateNftCollectionMetadata(payload) {
    const {
      data
    } = payload;

    const {
      _id
    } = data;

    const {
      formData,
      attributes
    } = NonFungibleTokenService.#convertFormData(data);

    const updateNftCollectionMetadataCmd = new UpdateNftCollectionMetadataCmd({
      _id,
      attributes
    });

    const msg = new MultFormDataMsg(
      formData,
      { appCmds: [updateNftCollectionMetadataCmd] },
      { 'entity-id': _id }
    );
    const response = await this.nonFungibleTokenHttp.updateNftCollectionMetadata(msg);

    const { RETURN_MSG } = this.proxydi.get('env');

    if (RETURN_MSG === true) {
      return msg;
    }

    return response;
  }

  /**
   * Create nft item and nft item metadata
   * @param {import('@casimir/platform-core').NonFungibleTokenIssuePayload} payload
   * @return {Promise<Object>}
   */
  async createNftItem(payload) {
    const {
      initiator: { privKey },
      data: {
        issuer,
        nftCollectionId,
        nftItemId,
        recipient,
        ownedByTeam = false,
        nftItemMetadataDraftId,
        authors = [],
        attributes = []
      }
    } = payload;
    const env = this.proxydi.get('env');

    const chainService = await ChainService.getInstanceAsync(env);
    const chainTxBuilder = chainService.getChainTxBuilder();

    const txBuilder = await chainTxBuilder.begin();

    const createNftItemCmd = new CreateNftItemCmd({
      issuer,
      nftCollectionId,
      nftItemId,
      recipient,
      ownedByTeam
    });
    txBuilder.addCmd(createNftItemCmd);

    const packedTx = await txBuilder.end();

    const chainNodeClient = chainService.getChainNodeClient();
    const chainInfo = chainService.getChainInfo();
    let signedTx;

    if (env.WALLET_URL) {
      signedTx = await walletSignTx(packedTx, chainInfo);
    } else {
      signedTx = await packedTx.signAsync(privKey, chainNodeClient);
    }

    const itemMsg = new JsonDataMsg(signedTx.getPayload());

    if (env.RETURN_MSG === true) {
      return itemMsg;
    }

    await this.nonFungibleTokenHttp.createNftItem(itemMsg);

    const createNftItemMetadataCmd = new CreateNftItemMetadataCmd({
      entityId: nftItemId,
      nftCollectionId,
      owner: recipient,
      ownedByTeam,
      nftItemMetadataDraftId,
      authors,
      attributes
    });

    const metadataMsg = new JsonDataMsg(
      { appCmds: [createNftItemMetadataCmd] },
      {
        'nft-collection-id': nftCollectionId,
        'nft-item-id': nftItemId
      }
    );

    const response = await this.nonFungibleTokenHttp.createNftItemMetadata(metadataMsg);

    await this.webSocketService.waitForMessage((message) => {
      const [, eventBody] = message;
      return eventBody.event.eventNum === APP_EVENT.NFT_ITEM_METADATA_CREATED
        && eventBody.event.eventPayload.entityId === response.data._id;
    }, 10000);

    return response;
  }

  /**
   * Create nft item metadata draft
   * @param {Object} payload.data
   * @param {string} payload.data.nftCollectionId
   * @param {string} payload.data.nftItemId
   * @param {number} payload.data.formatType
   * @param {Object} payload.data.jsonData
   * @param {number} payload.data.status
   * @param {string} payload.data.owner,
   * @param {boolean} payload.data.ownedByTeam,
   * @param {Array.<Object>} payload.data.attributes
   * @returns {Promise<Object>}
   */
  async createNftItemMetadataDraft(payload) {
    const { data } = payload;

    const {
      formData,
      attributes
    } = NonFungibleTokenService.#convertFormData(payload.data);
    const commandData = { ...data, attributes };

    const createNftItemMetadataDraftCmd = new CreateNftItemMetadataDraftCmd(commandData);
    const msg = new MultFormDataMsg(
      formData,
      { appCmds: [createNftItemMetadataDraftCmd] },
      {
        'nft-collection-id': data.nftCollectionId,
        'nft-item-id': data.nftItemId
      },
    );

    const { RETURN_MSG } = this.proxydi.get('env');

    if (RETURN_MSG === true) {
      return msg;
    }

    const response = await this.nonFungibleTokenHttp.createNftItemMetadataDraft(msg);

    await this.webSocketService.waitForMessage((message) => {
      const [, eventBody] = message;
      return eventBody.event.eventNum === APP_EVENT.NFT_ITEM_METADATA_DRAFT_CREATED
        && eventBody.event.eventPayload.entityId === response.data._id;
    }, 20000);

    return response;
  }

  /**
   * Update nft item metadata draft
   * @param {Object} payload.data
   * @param {string} payload.data._id,
   * @param {number} payload.data.formatType
   * @param {Object} payload.data.jsonData
   * @param {string} payload.data.nftCollectionId,
   * @param {Array.<Object>} payload.data.attributes
   * @returns {Promise<Object>}
   */
  async updateNftItemMetadataDraft(payload) {
    const { data } = payload;

    const {
      formData,
      attributes
    } = NonFungibleTokenService.#convertFormData(payload.data);
    const commandData = { ...data, attributes };

    const updateNftItemMetadataDraftCmd = new UpdateNftItemMetadataDraftCmd(commandData);
    const msg = new MultFormDataMsg(
      formData,
      { appCmds: [updateNftItemMetadataDraftCmd] },
      {
        'nft-collection-id': data.nftCollectionId,
        'nft-item-id': data.nftItemId
      }
    );

    const { RETURN_MSG } = this.proxydi.get('env');

    if (RETURN_MSG === true) {
      return msg;
    }

    const response = await this.nonFungibleTokenHttp.updateNftItemMetadataDraft(msg);

    return response;
  }

  /**
   * Delete nft item metadata draft
   * @param {string} nftItemMetadataDraftId
   * @returns {Promise<Object>}
   */
  async deleteNftItemMetadataDraft(nftItemMetadataDraftId) {
    const deleteNftItemMetadataDraftCmd = new DeleteNftItemMetadataDraftCmd({
      _id: nftItemMetadataDraftId
    });
    const msg = new JsonDataMsg(
      { appCmds: [deleteNftItemMetadataDraftCmd] },
      { 'entity-id': nftItemMetadataDraftId }
    );
    const { RETURN_MSG } = this.proxydi.get('env');

    if (RETURN_MSG === true) {
      return msg;
    }

    return this.nonFungibleTokenHttp.deleteNftItemMetadataDraft(msg);
  }

  /**
   * Moderate nft item metadata draft
   * @param {Object} payload
   * @param {Object} payload.data
   * @param {string} payload.data._id
   * @param {string} payload.data.status NftItemMetadataDraftStatus
   * @param {string} payload.data.moderationMessage
   * @returns
   */
  async moderateNftItemMetadataDraft(payload) {
    const { data } = payload;
    const { _id, status, moderationMessage } = data;

    const appCmds = [];

    const updateStatusCmd = new UpdateNftItemMetadataDraftStatusCmd({ _id, status });
    appCmds.push(updateStatusCmd);

    if (moderationMessage) {
      const updateMetadataCmd = new UpdateNftItemMetadataDraftModerationMsgCmd({
        _id,
        moderationMessage
      });
      appCmds.push(updateMetadataCmd);
    }

    const msg = new JsonDataMsg({ appCmds }, { 'entity-id': _id });

    const { RETURN_MSG } = this.proxydi.get('env');

    if (RETURN_MSG === true) {
      return msg;
    }

    const response = await this.nonFungibleTokenHttp.moderateNftItemMetadataDraft(msg);

    await this.webSocketService.waitForMessage((message) => {
      const [, eventBody] = message;
      const { event: { eventNum, eventPayload } } = eventBody;
      const statusUpdated = eventNum === APP_EVENT.NFT_ITEM_METADATA_DRAFT_STATUS_UPDATED
        && eventPayload._id === response.data._id;

      const lazyProposalDeclined = eventNum === APP_EVENT.NFT_LAZY_SELL_PROPOSAL_DECLINED;
      return statusUpdated || lazyProposalDeclined;
    }, 20000);

    return response;
  }

  /**
   * Transfer non-fungible token
   * @param{import('@casimir/platform-core').NonFungibleTokenTransferPayload} payload
   * @return {Promise<Object>}
   */
  async transfer(payload) {
    const transferPayload = updateProposalInfo(payload);

    const {
      data: { from, to, token }
    } = transferPayload;

    const transferTokenCmd = new TransferNFTCmd({
      from,
      to,
      nftCollectionId: token.nftCollectionId,
      nftItemId: token.nftItemId
    });

    return transferToken(
      transferPayload,
      transferTokenCmd,
      APP_PROPOSAL.NFT_TRANSFER_PROPOSAL,
      this.nonFungibleTokenHttp.transfer
    );
  }

  /**
  * Create lazy mint proposal for selling nft instance on behalf creator
  * @param {import('@casimir/platform-core').NonFungibleTokenLazySellPayload} payload
  * @return {Promise<Object>}
  */
  async sellLazy(payload) {
    const env = this.proxydi.get('env');
    const {
      initiator: { privKey },
      data: {
        issuer,
        nftCollectionId,
        nftItemId,
        asset
      }
    } = payload;

    const {
      // eslint-disable-next-line camelcase
      TENANT_HOT_WALLET_DAO_ID,
      LAZY_BUY_PROPOSAL_EXPIRATION = 30 * 24 * 3600e3 // month in milliseconds
    } = env;
    const lazySellProposalExpirationTime = Date.now() + LAZY_BUY_PROPOSAL_EXPIRATION;

    const chainService = await ChainService.getInstanceAsync(env);
    const chainTxBuilder = chainService.getChainTxBuilder();

    const txBuilder = await chainTxBuilder.begin();

    const transferFtCmd = new TransferFTCmd({
      from: TENANT_HOT_WALLET_DAO_ID,
      to: issuer,
      amount: asset.amount,
      tokenId: asset.id,
      symbol: asset.symbol,
      precision: asset.precision
    });

    const createNftCmd = new CreateNftItemCmd({
      issuer,
      recipient: TENANT_HOT_WALLET_DAO_ID,
      nftCollectionId,
      nftItemId
    });

    const proposalBatch = [
      transferFtCmd,
      createNftCmd
    ];

    const batchWeight = await chainTxBuilder.getBatchWeight(proposalBatch);

    const createProposalCmd = new CreateProposalCmd({
      type: APP_PROPOSAL.NFT_LAZY_SELL_PROPOSAL,
      creator: issuer,
      expirationTime: lazySellProposalExpirationTime,
      proposedCmds: proposalBatch,
      batchWeight
    });

    txBuilder.addCmd(createProposalCmd);

    const lazySellProposalId = createProposalCmd.getProtocolEntityId();
    const acceptProposalCmd = new AcceptProposalCmd({
      entityId: lazySellProposalId,
      account: issuer,
      batchWeight
    });

    txBuilder.addCmd(acceptProposalCmd);

    const packedTx = await txBuilder.end();

    const chainNodeClient = chainService.getChainNodeClient();
    const chainInfo = chainService.getChainInfo();
    let signedTx;

    if (env.WALLET_URL) {
      signedTx = await walletSignTx(packedTx, chainInfo);
    } else {
      signedTx = await packedTx.signAsync(privKey, chainNodeClient);
    }

    const msg = new JsonDataMsg(signedTx.getPayload());

    if (env.RETURN_MSG === true) {
      return msg;
    }

    const response = await this.nonFungibleTokenHttp.lazySell(msg);

    await this.webSocketService.waitForMessage((message) => {
      const [, eventBody] = message;
      return eventBody.event.eventNum === APP_EVENT.NFT_LAZY_SELL_PROPOSAL_CREATED
        && eventBody.event.eventPayload.proposalId === response.data.entityId;
    }, 30000);

    return response;
  }

  /**
   * Create lazy mint proposal for buying nft instance on behalf buyer
   * @param {import('@casimir/platform-core').NonFungibleTokenLazyBuyPayload} payload
   * @return {Promise<Object>}
   */
  async buyLazy(payload) {
    const env = this.proxydi.get('env');
    const {
      initiator: { privKey },
      data: {
        issuer,
        nftCollectionId,
        nftItemId,
        lazySellProposalId,
        asset
      }
    } = payload;

    const {
      // eslint-disable-next-line camelcase
      TENANT_HOT_WALLET_DAO_ID, LAZY_BUY_PROPOSAL_EXPIRATION = 60e3 // minute in milliseconds
    } = env;

    const lazyBuyProposalExpirationTime = Date.now() + LAZY_BUY_PROPOSAL_EXPIRATION;

    const chainService = await ChainService.getInstanceAsync(env);
    const chainTxBuilder = chainService.getChainTxBuilder();
    const chainRpc = chainService.getChainRpc();

    const lazySellProposal = await chainRpc.getProposalAsync(lazySellProposalId);

    const txBuilder = await chainTxBuilder.begin();

    const transferFtCmd = new TransferFTCmd({
      from: issuer,
      to: TENANT_HOT_WALLET_DAO_ID,
      amount: asset.amount,
      tokenId: asset.id,
      symbol: asset.symbol,
      precision: asset.precision
    });

    const acceptSellProposalCmd = new AcceptProposalCmd({
      entityId: lazySellProposalId,
      account: TENANT_HOT_WALLET_DAO_ID,
      batchWeight: lazySellProposal.batchWeight
    });

    const transferNftCmd = new TransferNFTCmd({
      from: TENANT_HOT_WALLET_DAO_ID,
      to: issuer,
      nftCollectionId,
      nftItemId
    });

    const proposalBatch = [
      transferFtCmd,
      acceptSellProposalCmd,
      transferNftCmd
    ];

    const batchWeight = await chainTxBuilder.getBatchWeight(proposalBatch);

    const createProposalCmd = new CreateProposalCmd({
      type: APP_PROPOSAL.NFT_LAZY_BUY_PROPOSAL,
      creator: issuer,
      expirationTime: lazyBuyProposalExpirationTime,
      proposedCmds: proposalBatch,
      batchWeight
    });

    txBuilder.addCmd(createProposalCmd);

    const lazyBuyProposalId = createProposalCmd.getProtocolEntityId();
    const acceptProposalCmd = new AcceptProposalCmd({
      entityId: lazyBuyProposalId,
      account: issuer,
      batchWeight
    });

    txBuilder.addCmd(acceptProposalCmd);

    const packedTx = await txBuilder.end();

    const chainNodeClient = chainService.getChainNodeClient();
    const chainInfo = chainService.getChainInfo();
    let signedTx;

    if (env.WALLET_URL) {
      signedTx = await walletSignTx(packedTx, chainInfo);
    } else {
      signedTx = await packedTx.signAsync(privKey, chainNodeClient);
    }

    const msg = new JsonDataMsg(signedTx.getPayload());

    if (env.RETURN_MSG === true) {
      return msg;
    }

    const response = await this.nonFungibleTokenHttp.lazyBuy(msg);

    await this.webSocketService.waitForMessage((message) => {
      const [, eventBody] = message;
      return eventBody.event.eventNum === APP_EVENT.NFT_LAZY_SELL_PROPOSAL_ACCEPTED
        && eventBody.event.eventPayload.proposalId === lazySellProposalId;
    }, 30000);

    return response;
  }

  /**
   * Get nft collection by id
   * @param {string} nftCollectionId
   * @return {Promise<Object>}
   */
  async getNftCollection(nftCollectionId) {
    return this.nonFungibleTokenHttp.getNftCollection(nftCollectionId);
  }

  /**
   * Get nft collections list by ids
   * @param {Array.<string>} ids
   * @returns {Promise<Object>}
   */
  async getNftCollectionsListByIds(ids) {
    return this.nonFungibleTokenHttp.getNftCollectionsListByIds(ids);
  }

  /**
   * Get public nft collections list
   * @param {Object} filter
   * @param {Array} filter.attributes
   * @param {Array.<string>} filter.attributes
   * @returns {Promise<Object>}
   */
  async getNftCollectionsList(filter = {}) {
    const {
      attributes = [],
      portalIds = []
    } = filter;

    return this.nonFungibleTokenHttp.getNftCollectionsList({
      attributes,
      portalIds
    });
  }

  /**
   * Get nft item
   * @param {string|number} nftCollectionId
   * @param {string|number} nftItemId
   * @returns {Promise<Object>}
   */
  async getNftItem(nftCollectionId, nftItemId) {
    return this.nonFungibleTokenHttp.getNftItem(nftCollectionId, nftItemId);
  }

  /**
   * Get nft collections list by issuer
   * @param {string} issuer
   * @returns {Promise<Object>}
   */
  async getNftCollectionsListByIssuer(issuer) {
    return this.nonFungibleTokenHttp.getNftCollectionsListByIssuer(issuer);
  }

  /**
   * Get public nft items list
   * @returns {Promise<Object>}
   */
  async getNftItemsList() {
    return this.nonFungibleTokenHttp.getNftItemsList();
  }

  /**
   * Get nft items list by nft collection
   * @param {string} id
   */
  async getNftItemsListByNftCollection(id) {
    return this.nonFungibleTokenHttp.getNftItemsListByNftCollection(id);
  }

  /**
   * Get nft items list paginated
   * @param {Object} query
   * @param {Object} query.sort 'asc', 'desc'
   * @param {Number} query.page 0 or above
   * @param {Number} query.pageSize from 1 to 100
   * @param {Object} query.filter
   */
  async getNftItemsListPaginated(query) {
    return this.nonFungibleTokenHttp.getNftItemsListPaginated(query);
  }

  /**
   * Get nft item metadata drafts list paginated
   * @param {Object} query
   * @param {Object} query.sort 'asc', 'desc'
   * @param {Number} query.page 0 or above
   * @param {Number} query.pageSize from 1 to 100
   * @param {Object} query.filter
   */
  async getNftItemMetadataDraftsListPaginated(query) {
    return this.nonFungibleTokenHttp.getNftItemMetadataDraftsListPaginated(query);
  }

  /**
   * Get nft item metadata drafts list by nft collection
   * @param {string} nftCollectionId
   * @returns {Promise<Object>}
   */
  async getNftItemMetadataDraftsByNftCollection(nftCollectionId) {
    return this.nonFungibleTokenHttp.getNftItemMetadataDraftsByNftCollection(nftCollectionId);
  }

  /**
   * Get nft item metadata draft by id
   * @param {string} id
   * @returns {Promise<Object>}
   */
  async getNftItemMetadataDraft(id) {
    return this.nonFungibleTokenHttp.getNftItemMetadataDraft(id);
  }

  /**
   * Get nft collection list for portal
   * @returns {Promise<Object>}
   */
  async getPortalNftCollectionList() {
    return this.nonFungibleTokenHttp.getPortalNftCollectionList();
  }

  /** @type {() => NonFungibleTokenService} */
  static getInstance = makeSingletonInstance(() => new NonFungibleTokenService());
}
