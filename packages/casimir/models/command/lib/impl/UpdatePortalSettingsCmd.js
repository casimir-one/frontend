import { APP_CMD } from '@casimir/platform-core';
import { assert } from '@casimir/toolbox';
import AppCmd from '../base/AppCmd';

/**
 * Update portal settings command
 * @extends AppCmd
 */
class UpdatePortalSettingsCmd extends AppCmd {
  /**
   * Create command for portal settings update
   * @param {Object} cmdPayload
   * @param {string} cmdPayload.title
   * @param {string} cmdPayload.banner
   * @param {string} cmdPayload.logo
   */
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
