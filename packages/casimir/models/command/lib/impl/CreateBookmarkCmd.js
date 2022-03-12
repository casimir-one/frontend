import { APP_CMD } from '@deip/constants';
import { assert } from '@deip/toolbox';
import AppCmd from '../base/AppCmd';

/**
 * Create bookmark command
 * @extends AppCmd
 */
class CreateBookmarkCmd extends AppCmd {
  /**
   * Create command for bookmark creation
   * @param {Object} cmdPayload
   * @param {string} cmdPayload.username
   * @param {string} cmdPayload.ref
   * @param {number} cmdPayload.type
   */
  constructor(cmdPayload) {
    const {
      username,
      ref,
      type
    } = cmdPayload;

    assert(!!username, "'username' is required");
    assert(!!ref, "'ref' is required");
    assert(!!type, "'type' is required");

    super(APP_CMD.CREATE_BOOKMARK, cmdPayload);
  }
}

export default CreateBookmarkCmd;
