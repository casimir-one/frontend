import AppCmd from './../base/AppCmd';
import { APP_CMD } from '@deip/constants';
import { assert } from '@deip/toolbox';

class DeleteBookmarkCmd extends AppCmd {

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
