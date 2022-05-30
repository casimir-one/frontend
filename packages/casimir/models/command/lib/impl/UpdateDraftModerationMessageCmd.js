import { APP_CMD } from '@deip/constants';
import { assert } from '@deip/toolbox';
import AppCmd from '../base/AppCmd';

/**
 * Update project content draft command
 * @extends AppCmd
 */
class UpdateDraftModerationMessageCmd extends AppCmd {
  /**
   * Create command for project content draft update
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

    super(APP_CMD.UPDATE_DRAFT_MODERATION_MESSAGE, cmdPayload);
  }
}

export default UpdateDraftModerationMessageCmd;
