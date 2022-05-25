import { APP_CMD } from '@deip/constants';
import { assert } from '@deip/toolbox';
import AppEntityCmd from '../base/AppEntityCmd';

/**
 * Create nft item metadata command
 * @extends AppEntityCmd
 */
class CreateNftItemMetadataCmd extends AppEntityCmd {
  /**
   * Create command for nft item metadata creation
   * @param {Object} cmdPayload
   * @param {string} cmdPayload.entityId
   * @param {string} cmdPayload.nftCollectionId
   * @param {string} cmdPayload.title
   * @param {number} cmdPayload.contentType
   * @param {string} cmdPayload.nftItemMetadataDraftId
   * @param {string} cmdPayload.description
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
      issuer,
      description,
      nftItemMetadataDraftId,

      // offchain
      // eslint-disable-next-line no-unused-vars
      attributes
    } = cmdPayload;

    assert(!!nftCollectionId, "'nftCollectionId' is required");
    assert(!!description, "'description' is required");
    assert(!!nftItemMetadataDraftId, "'nftItemMetadataDraftId' is required");
    assert(!!owner, "'owner' is required");
    assert(!!issuer, "'issuer' is required");

    super(APP_CMD.CREATE_NFT_ITEM_METADATA, cmdPayload);
  }
}

export default CreateNftItemMetadataCmd;
