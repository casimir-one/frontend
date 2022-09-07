import { APP_CMD } from '@casimir.one/platform-core';
import { assert } from '@casimir.one/toolbox';
import AppCmd from '../base/AppCmd';

/**
 * Update nft item metadata draft command
 * @extends AppCmd
 */
class UpdateNftItemMetadataDraftCmd extends AppCmd {
  /**
   * Create command for nft item metadata draft update
   * @param {Object} cmdPayload
   * @param {string} cmdPayload._id
   * @param {string} cmdPayload.lazySellProposalId //TODO: remove when we have onchain market
   * @param {Array.<string>} cmdPayload.authors
   * @param {Array.<Object>} cmdPayload.attributes
   */
  constructor(cmdPayload) {
    const {
      _id
    } = cmdPayload;

    assert(!!_id, "'_id' is required");

    super(APP_CMD.UPDATE_NFT_ITEM_METADATA_DRAFT, cmdPayload);
  }
}

export default UpdateNftItemMetadataDraftCmd;
