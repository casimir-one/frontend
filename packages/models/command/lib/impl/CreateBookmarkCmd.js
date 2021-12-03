import AppCmd from './../base/AppCmd';
import { APP_CMD } from '@deip/constants';
import { assert } from '@deip/toolbox';

class CreateBookmarkCmd extends AppCmd {

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
