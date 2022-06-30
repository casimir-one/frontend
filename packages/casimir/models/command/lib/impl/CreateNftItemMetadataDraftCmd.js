import { APP_CMD, NFT_ITEM_METADATA_FORMAT, NftItemMetadataDraftStatus }
  from '@casimir/platform-core';
import { assert } from '@deip/toolbox';
import AppEntityCmd from '../base/AppEntityCmd';

/**
 * Create nft item metadata draft command
 * @extends AppCmd
 */
class CreateNftItemMetadataDraftCmd extends AppEntityCmd {
  /**
   * Create command for project content draft creation
   * @param {Object} cmdPayload
   * @param {string} cmdPayload.nftCollectionId
   * @param {Object} cmdPayload.formatType
   * @param {string} cmdPayload.entityId
   * @param {Object} cmdPayload.jsonData
   * @param {string} cmdPayload.title
   * @param {Array.<string>} cmdPayload.authors
   * @param {string} cmdPayload.owner
   * @param {Array.<string>} cmdPayload.references
   * @param {Array.<Object>} cmdPayload.attributes
   * @param {number} cmdPayload.formatType
   * @param {Object} cmdPayload.jsonData
   * @param {Object} cmdPayload.metadata
   * @param {Object} cmdPayload.status
   */
  constructor(cmdPayload) {
    const {
      nftCollectionId,
      nftItemId,
      formatType,
      jsonData,
      status,
      owner,
      // eslint-disable-next-line no-unused-vars
      attributes
    } = cmdPayload;

    assert(!!nftCollectionId, "'nftCollectionId' is required");
    assert(!!nftItemId, "'nftItemId' is required");
    assert(!!formatType, "'formatType' is required");
    assert(!!owner, "'owner' is required");

    if (formatType === NFT_ITEM_METADATA_FORMAT.JSON) {
      assert(!!jsonData, `'jsonData' is required for ${formatType} formatType`);
    }

    if (status) {
      assert(Object.values(NftItemMetadataDraftStatus).includes(status), "'status' is invalid");
    }

    super(APP_CMD.CREATE_NFT_ITEM_METADATA_DRAFT, cmdPayload);
  }
}

export default CreateNftItemMetadataDraftCmd;
