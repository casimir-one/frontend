import {
  makeSingletonInstance,
  createFormData,
  replaceFileWithName
} from '@deip/toolbox';
import { proxydi } from '@deip/proxydi';
import { JsonDataMsg, MultFormDataMsg } from '@deip/messages';
import {
  TransferNFTCmd,
  CreateNftCollectionCmd,
  CreateNftItemCmd,
  CreateNftCollectionMetadataCmd,
  UpdateNftItemMetadataDraftCmd,
  CreateNftItemMetadataDraftCmd,
  DeleteNftItemMetadataDraftCmd,
  CreateNftItemMetadataCmd,
  UpdateNftCollectionMetadataCmd,
  UpdateNftItemMetadataDraftStatusCmd,
  UpdateNftItemMetadataDraftModerationMsgCmd
} from '@deip/commands';
import { APP_PROPOSAL, APP_EVENT } from '@deip/constants';
import { ChainService } from '@deip/chain-service';
import { WebSocketService } from '@deip/web-socket-service';
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
   * @return {Promise<Object>}
   */
  async createNftCollection(payload) {
    const {
      initiator: { privKey },
      data: {
        issuer,
        issuedByTeam,
        metadata
      }
    } = payload;
    const env = this.proxydi.get('env');
    let nftCollectionId;
    await ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const chainNodeClient = chainService.getChainNodeClient();
        const chainTxBuilder = chainService.getChainTxBuilder();
        const chainRpc = chainService.getChainRpc();

        return chainTxBuilder.begin()
          .then(async (txBuilder) => {
            const entityId = await chainRpc.getNextAvailableNftCollectionId();
            nftCollectionId = entityId;
            const createNftCollectionCmd = new CreateNftCollectionCmd({
              entityId,
              issuer,
              issuedByTeam
            });

            txBuilder.addCmd(createNftCollectionCmd);
            return txBuilder.end();
          })
          .then((packedTx) => packedTx.signAsync(privKey, chainNodeClient))
          .then((packedTx) => {
            const msg = new JsonDataMsg(packedTx.getPayload());

            if (env.RETURN_MSG === true) {
              return msg;
            }

            return this.nonFungibleTokenHttp.create(msg);
          });
      });

    const {
      formData,
      attributes
    } = NonFungibleTokenService.#convertFormData(metadata);

    const createNftCollectionMetadataCmd = new CreateNftCollectionMetadataCmd({
      entityId: nftCollectionId,
      issuer,
      issuedByTeam,
      attributes
    });
    const msg = new MultFormDataMsg(formData, { appCmds: [createNftCollectionMetadataCmd] });
    const response = await this.nonFungibleTokenHttp.createNftCollectionMetadata(msg);

    await this.webSocketService.waitForMessage((message) => {
      const [, eventBody] = message;
      return eventBody.event.eventNum === APP_EVENT.NFT_COLLECTION_METADATA_CREATED
                  && eventBody.event.eventPayload.entityId === response.data._id;
    }, 10000);

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
        metadata: {
          contentType,
          title,
          nftItemMetadataDraftId,
          authors = [],
          metadata = {},
          references = []
        }
      }
    } = payload;
    const env = this.proxydi.get('env');

    await ChainService.getInstanceAsync(env)
      .then((chainService) => {
        const chainNodeClient = chainService.getChainNodeClient();
        const chainTxBuilder = chainService.getChainTxBuilder();

        return chainTxBuilder.begin()
          .then((txBuilder) => {
            const createNftItemCmd = new CreateNftItemCmd({
              issuer,
              nftCollectionId,
              nftItemId,
              recipient,
              ownedByTeam
            });
            txBuilder.addCmd(createNftItemCmd);
            return txBuilder.end();
          })
          .then((packedTx) => packedTx.signAsync(privKey, chainNodeClient))
          .then((packedTx) => {
            const msg = new JsonDataMsg(packedTx.getPayload());

            if (env.RETURN_MSG === true) {
              return msg;
            }

            return this.nonFungibleTokenHttp.createNftItem(msg);
          });
      });

    const createNftItemMetadataCmd = new CreateNftItemMetadataCmd({
      entityId: nftItemId,
      nftCollectionId,
      owner: recipient,
      ownedByTeam,
      contentType,
      nftItemMetadataDraftId,
      authors,
      metadata,
      references,
      title
    });

    const msg = new JsonDataMsg(
      { appCmds: [createNftItemMetadataCmd] },
      { 'nft-collection-id': nftCollectionId }
    );

    const response = await this.nonFungibleTokenHttp.createNftItemMetadata(msg);

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
   * @param {number} payload.data.formatType
   * @param {Object} payload.data.jsonData
   * @param {number} payload.data.status
   * @param {string} payload.data.owner,
   * @param {boolean} payload.data.ownedByTeam,
   * @param {Array.<Object>} payload.data.attributes
   * @returns {Promise<Object>}
   */
  async createNftItemMetadataDraft(payload) {
    const {
      data
    } = payload;

    const formData = createFormData(data);

    const createNftItemMetadataDraftCmd = new CreateNftItemMetadataDraftCmd(data);
    const msg = new MultFormDataMsg(
      formData,
      { appCmds: [createNftItemMetadataDraftCmd] },
      { 'nft-collection-id': data.nftCollectionId }
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
    }, 10000);

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
    const formData = createFormData(data);

    const updateNftItemMetadataDraftCmd = new UpdateNftItemMetadataDraftCmd(data);
    const msg = new MultFormDataMsg(
      formData,
      { appCmds: [updateNftItemMetadataDraftCmd] },
      { 'entity-id': data._id }
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
   * @param {string} payload.data.status NFT_ITEM_METADATA_DRAFT_STATUS
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
      return eventBody.event.eventNum === APP_EVENT.NFT_ITEM_METADATA_DRAFT_STATUS_UPDATED
                  && eventBody.event.eventPayload._id === response.data._id;
    }, 10000);

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
   * Get nft collection by id
   * @param {string} nftCollectionId
   * @returns {Promise<Object>}
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
   * Get default nft collection by issuer
   * @param {string} issuer
   * @returns {Promise<Object>}
   */
  async getDefaultNftCollectionByIssuer(issuer) {
    return this.nonFungibleTokenHttp.getDefaultNftCollectionByIssuer(issuer);
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
   * @param {string} id
   * @returns {Promise<Object>}
   */
  async getNftItem(id) {
    return this.nonFungibleTokenHttp.getNftItem(id);
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
