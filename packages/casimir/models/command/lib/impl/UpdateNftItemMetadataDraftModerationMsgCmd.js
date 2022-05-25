import { APP_CMD } from '@deip/constants';
import { assert } from '@deip/toolbox';
import AppCmd from '../base/AppCmd';

/**
 * Update nft item metadata draft command
 * @extends AppCmd
 */
class UpdateNftItemMetadataDraftModerationMsgCmd extends AppCmd {
  /**
   * Create command for nft item metadata draft moderation message update
   * @param {Object} cmdPayload
   * @param {string} cmdPayload._id
   * @param {Object} cmdPayload.moderationMessage
   */
  constructor(cmdPayload) {
    const {
      _id,
      moderationMessage
    } = cmdPayload;

    assert(!!_id, "'_id' is required");
    assert(!!moderationMessage, "'moderationMessage' is required");

    super(APP_CMD.UPDATE_NFT_ITEM_METADATA_DRAFT_MODERATION_MSG, cmdPayload);
  }
}

export default UpdateNftItemMetadataDraftModerationMsgCmd;
