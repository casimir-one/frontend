import { APP_CMD, NftItemMetadataDraftStatus }
  from '@casimir.one/platform-core';
import { assert } from '@casimir.one/toolbox';
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
   * @param {string} cmdPayload.entityId
   * @param {Array.<string>} cmdPayload.authors
   * @param {string} cmdPayload.owner
   * @param {Array.<Object>} cmdPayload.attributes
   * @param {Object} cmdPayload.status
   */
  constructor(cmdPayload) {
    const {
      nftCollectionId,
      nftItemId,
      status,
      owner,
      // eslint-disable-next-line no-unused-vars
      attributes
    } = cmdPayload;

    assert(!!nftCollectionId, "'nftCollectionId' is required");
    assert(!!nftItemId, "'nftItemId' is required");

    assert(!!owner, "'owner' is required");

    if (status) {
      assert(Object.values(NftItemMetadataDraftStatus).includes(status), "'status' is invalid");
    }

    super(APP_CMD.CREATE_NFT_ITEM_METADATA_DRAFT, cmdPayload);
  }
}

export default CreateNftItemMetadataDraftCmd;
