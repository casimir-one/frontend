import { APP_CMD } from '@casimir.one/platform-core';
import { assert } from '@casimir.one/toolbox';
import AppCmd from '../base/AppCmd';

/**
 * Update network settings command
 * @extends AppCmd
 */
class UpdateNetworkSettingsCmd extends AppCmd {
  /**
   * Create command for network settings update
   * @param {Object} cmdPayload
   */
  constructor(cmdPayload) {
    const networkSettings = cmdPayload;

    assert(!!networkSettings, "'networkSettings' is required");

    super(APP_CMD.UPDATE_NETWORK_SETTINGS, cmdPayload);
  }
}

export default UpdateNetworkSettingsCmd;
