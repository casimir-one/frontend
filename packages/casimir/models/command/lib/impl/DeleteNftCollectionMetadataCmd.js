import { APP_CMD } from '@deip/constants';
import { assert } from '@deip/toolbox';
import AppCmd from '../base/AppCmd';

/**
 * Delete nft collection metadata command
 * @extends AppCmd
 */
class DeleteNftCollectionMetadataCmd extends AppCmd {
  /**
   * Create command for project deletion
   * @param {Object} cmdPayload
   * @param {string} cmdPayload._id
   */
  constructor(cmdPayload) {
    const {
      _id
    } = cmdPayload;

    assert(!!_id, "'_id' is required");

    super(APP_CMD.DELETE_NFT_COLLECTION_METADATA, cmdPayload);
  }
}

export default DeleteNftCollectionMetadataCmd;
