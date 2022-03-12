import { APP_CMD } from '@deip/constants';
import { assert } from '@deip/toolbox';
import AppCmd from '../base/AppCmd';

/**
 * Delete bookmark command
 * @extends AppCmd
 */
class DeleteBookmarkCmd extends AppCmd {
  /**
   * Create command for bookmark deletion
   * @param {Object} cmdPayload
   * @param {string} cmdPayload.username
   * @param {string} cmdPayload.bookmarkId
   */
  constructor(cmdPayload) {
    const {
      username,
      bookmarkId
    } = cmdPayload;

    assert(!!username, "'username' is required");
    assert(!!bookmarkId, "'bookmarkId' is required");

    super(APP_CMD.DELETE_BOOKMARK, cmdPayload);
  }
}

export default DeleteBookmarkCmd;
