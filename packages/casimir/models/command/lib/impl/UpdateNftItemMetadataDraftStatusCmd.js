import { APP_CMD, NftItemMetadataDraftStatus } from '@casimir.one/platform-core';
import { assert } from '@casimir.one/toolbox';
import AppCmd from '../base/AppCmd';

/**
 * Update nft item metadata draft command
 * @extends AppCmd
 */
class UpdateNftItemMetadataDraftStatusCmd extends AppCmd {
  /**
   * Create command for nft item metadata draft status update
   * @param {Object} cmdPayload
   * @param {string} cmdPayload._id
   * @param {number} cmdPayload.status
   */
  constructor(cmdPayload) {
    const {
      _id,
      status
    } = cmdPayload;

    assert(!!_id, "'_id' is required");
    assert(!!status, "'status' is required");
    assert(Object.values(NftItemMetadataDraftStatus).includes(status), "'status' is invalid");

    super(APP_CMD.UPDATE_NFT_ITEM_METADATA_DRAFT_STATUS, cmdPayload);
  }
}

export default UpdateNftItemMetadataDraftStatusCmd;
