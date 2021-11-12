import AppCmd from './../base/AppCmd';
import { APP_CMD } from '@deip/constants';
import { assert } from '@deip/toolbox';

class UpdatePortalProfileCmd extends AppCmd {

  constructor(cmdPayload) {

    const {
      settings
    } = cmdPayload;

    assert(!!settings, "'settings' is required");

    super(APP_CMD.UPDATE_PORTAL_PROFILE, cmdPayload);
  }

}

export default UpdatePortalProfileCmd;
