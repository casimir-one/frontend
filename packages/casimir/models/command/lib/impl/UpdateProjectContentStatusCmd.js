import { APP_CMD } from '@deip/constants';
import { assert } from '@deip/toolbox';
import AppCmd from '../base/AppCmd';

/**
 * Update project content status command
 * @extends AppCmd
 */
class UpdateProjectContentStatusCmd extends AppCmd {
  /**
   * Update command for project content status
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

    super(APP_CMD.UPDATE_PROJECT_CONTENT_STATUS, cmdPayload);
  }
}

export default UpdateProjectContentStatusCmd;
