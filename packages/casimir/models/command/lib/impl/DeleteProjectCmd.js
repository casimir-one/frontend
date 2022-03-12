import { APP_CMD } from '@deip/constants';
import { assert } from '@deip/toolbox';
import AppCmd from '../base/AppCmd';

/**
 * Delete project command
 * @extends AppCmd
 */
class DeleteProjectCmd extends AppCmd {
  /**
   * Create command for project deletion
   * @param {Object} cmdPayload
   * @param {string} cmdPayload.entityId
   */
  constructor(cmdPayload) {
    const {
      entityId
    } = cmdPayload;

    assert(!!entityId, "'entityId' is required");

    super(APP_CMD.DELETE_PROJECT, cmdPayload);
  }
}

export default DeleteProjectCmd;
