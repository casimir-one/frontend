import { APP_CMD } from '@casimir/platform-core';
import { assert } from '@deip/toolbox';
import AppCmd from '../base/AppCmd';

/**
 * Create nft collection metadata command
 * @extends AppCmd
 */
class CreateNftCollectionMetadataCmd extends AppCmd {
  /**
   * Create command for nft collection metadata creation
   * @param {Object} cmdPayload
   * @param {string} cmdPayload.issuer
   * @param {string} cmdPayload.entityId
   * @param {Array.<Object>} cmdPayload.attributes
   */
  constructor(cmdPayload) {
    const {
      // onchain
      issuer,
      entityId
    } = cmdPayload;

    assert(!!entityId, "'entityId' is required");
    assert(!!issuer, "'issuer' is required");

    super(APP_CMD.CREATE_NFT_COLLECTION_METADATA, cmdPayload);
  }
}

export default CreateNftCollectionMetadataCmd;
