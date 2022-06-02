import { APP_CMD, PROJECT_CONTENT_DRAFT_STATUS } from '@deip/constants';
import { assert } from '@deip/toolbox';
import AppCmd from '../base/AppCmd';

/**
 * Update project content draft command
 * @extends AppCmd
 */
class UpdateDraftStatusCmd extends AppCmd {
  /**
   * Create command for project content draft status update
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
    assert(!!PROJECT_CONTENT_DRAFT_STATUS[status], "'status' is invalid");

    super(APP_CMD.UPDATE_DRAFT_STATUS, cmdPayload);
  }
}

export default UpdateDraftStatusCmd;
