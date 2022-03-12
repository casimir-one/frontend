import { APP_CMD } from '@deip/constants';
import { assert } from '@deip/toolbox';
import AppCmd from '../base/AppCmd';

/**
 * Delete project content draft command
 * @extends AppCmd
 */
class DeleteDraftCmd extends AppCmd {
  /**
   * Create command for project content draft delition
   * @param {Object} cmdPayload
   * @param {Object} cmdPayload.draftId
   */
  constructor(cmdPayload) {
    const {
      draftId
    } = cmdPayload;

    assert(!!draftId, "'draftId' is required");

    super(APP_CMD.DELETE_DRAFT, cmdPayload);
  }
}

export default DeleteDraftCmd;
