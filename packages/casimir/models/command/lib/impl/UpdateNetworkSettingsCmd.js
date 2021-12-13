import AppCmd from './../base/AppCmd';
import { APP_CMD } from '@deip/constants';
import { assert } from '@deip/toolbox';

class UpdateNetworkSettingsCmd extends AppCmd {

  constructor(cmdPayload) {

    const networkSettings = cmdPayload;

    assert(!!networkSettings, "'networkSettings' is required");

    super(APP_CMD.UPDATE_NETWORK_SETTINGS, cmdPayload);
  }

}

export default UpdateNetworkSettingsCmd;
