import { APP_CMD } from '@casimir.one/platform-core';
import { assert } from '@casimir.one/toolbox';
import AppCmd from '../base/AppCmd';

/**
 * Create nft item metadata command
 * @extends AppCmd
 */
class CreateNftItemMetadataCmd extends AppCmd {
  /**
   * Create command for nft item metadata creation
   * @param {Object} cmdPayload
   * @param {string} cmdPayload.entityId
   * @param {string} cmdPayload.nftCollectionId
   * @param {string} cmdPayload.title
   * @param {string} cmdPayload.nftItemMetadataDraftId
   * @param {string} cmdPayload.owner
   * @param {Array.<string>} cmdPayload.authors
   * @param {Array.<string>} cmdPayload.references
   * @param {Array.<Object>} cmdPayload.attributes
   * @param {Object} cmdPayload.metadata
   */
  constructor(cmdPayload) {
    const {
      // onchain
      nftCollectionId,
      owner,
      nftItemMetadataDraftId,
      entityId,

      // offchain
      // eslint-disable-next-line no-unused-vars
      attributes
    } = cmdPayload;

    assert(!!nftCollectionId, "'nftCollectionId' is required");
    assert(!!nftItemMetadataDraftId, "'nftItemMetadataDraftId' is required");
    assert(!!owner, "'owner' is required");
    assert(!!entityId, "'entityId' is required");

    super(APP_CMD.CREATE_NFT_ITEM_METADATA, cmdPayload);
  }
}

export default CreateNftItemMetadataCmd;
