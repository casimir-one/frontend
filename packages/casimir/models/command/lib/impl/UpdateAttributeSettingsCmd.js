import { APP_CMD } from '@casimir/platform-core';
import { assert } from '@deip/toolbox';
import AppCmd from '../base/AppCmd';

/**
 * Update attribute settings command
 * @extends AppCmd
 */
class UpdateAttributeSettingsCmd extends AppCmd {
  /**
   * Create command for attribute settings update
   * @param {Object} cmdPayload
   */
  constructor(cmdPayload) {
    const attributeSettings = cmdPayload;

    assert(!!attributeSettings, "'attributeSettings' is required");

    super(APP_CMD.UPDATE_ATTRIBUTE_SETTINGS, cmdPayload);
  }
}

export default UpdateAttributeSettingsCmd;
