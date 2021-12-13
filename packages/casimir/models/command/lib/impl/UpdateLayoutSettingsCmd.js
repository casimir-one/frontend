import AppCmd from './../base/AppCmd';
import { APP_CMD } from '@deip/constants';
import { assert } from '@deip/toolbox';

class UpdateLayoutSettingsCmd extends AppCmd {

  constructor(cmdPayload) {
    const layoutSettings = cmdPayload

    assert(!!layoutSettings, "'layoutSettings' is required");

    super(APP_CMD.UPDATE_LAYOUT_SETTINGS, cmdPayload);
  }

}

export default UpdateLayoutSettingsCmd;
