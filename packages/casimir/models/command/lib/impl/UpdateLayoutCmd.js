import { APP_CMD } from '@casimir/platform-core';
import { assert, isArray } from '@casimir/toolbox';
import AppCmd from '../base/AppCmd';

/**
 * Update layout command
 * @extends AppCmd
 */
class UpdateLayoutCmd extends AppCmd {
  /**
   * Command for layout creation
   * @param {Object} cmdPayload
   * @param {string} cmdPayload._id
   * @param {string} cmdPayload.name
   * @param {Array.<Object>} cmdPayload.value
   * @param {string} cmdPayload.scope
   */
  constructor(cmdPayload) {
    const {
      _id: layoutId,
      name,
      value
    } = cmdPayload;

    assert(!!layoutId, "'layoutId' is required");
    assert(!!name, "'name' is required");
    assert(!!value && isArray(value), "'value' is required and should be an aray");

    super(APP_CMD.UPDATE_LAYOUT, cmdPayload);
  }
}

export default UpdateLayoutCmd;
