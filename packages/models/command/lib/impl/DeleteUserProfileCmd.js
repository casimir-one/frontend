import AppCmd from './../base/AppCmd';
import { APP_CMD } from '@deip/constants';
import { assert } from '@deip/toolbox';

class DeleteUserProfileCmd extends AppCmd {

  constructor(cmdPayload) {

    const {
      username
    } = cmdPayload;

    assert(!!username, "'username' is required");

    super(APP_CMD.DELETE_USER_PROFILE, cmdPayload);
  }

}

export default DeleteUserProfileCmd;
