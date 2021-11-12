import AppCmd from './../base/AppCmd';
import { APP_CMD } from '@deip/constants';
import { assert } from '@deip/toolbox';

class UpdatePortalSettingsCmd extends AppCmd {

  constructor(cmdPayload) {

    const {
      title,
      banner,
      logo
    } = cmdPayload;

    assert(!!title || !!banner || !!logo, "at least one of 'title', 'banner', 'logo' is required");

    super(APP_CMD.UPDATE_PORTAL_SETTINGS, cmdPayload);
  }

}

export default UpdatePortalSettingsCmd;
