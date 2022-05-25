import { APP_CMD } from '@deip/constants';
import { assert } from '@deip/toolbox';
import AppEntityCmd from '../base/AppEntityCmd';

/**
 * Create nft collection metadata command
 * @extends AppEntityCmd
 */
class CreateNftCollectionMetadataCmd extends AppEntityCmd {
  /**
   * Create command for nft collection metadata creation
   * @param {Object} cmdPayload
   * @param {string} cmdPayload.issuer
   * @param {string} cmdPayload.entityId
   * @param {Array.<string>} cmdPayload.domains
   * @param {Array.<Object>} cmdPayload.attributes
   */
  constructor(cmdPayload) {
    const {
      // onchain
      issuer,

      // offchain
      /* eslint-disable-next-line no-unused-vars */
      attributes
    } = cmdPayload;

    assert(!!issuer, "'issuer' is required");

    super(APP_CMD.CREATE_NFT_COLLECTION_METADATA, cmdPayload);
  }
}

export default CreateNftCollectionMetadataCmd;
