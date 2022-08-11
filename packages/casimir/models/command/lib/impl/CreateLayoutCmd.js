import { APP_CMD, AttributeScope } from '@casimir/platform-core';
import { assert, isArray } from '@casimir/toolbox';
import AppCmd from '../base/AppCmd';

/**
 * Create layout command
 * @extends AppCmd
 */
class CreateLayoutCmd extends AppCmd {
  /**
   * Command for layout creation
   * @param {Object} cmdPayload
   * @param {string} cmdPayload.name
   * @param {Array.<Object>} cmdPayload.value
   * @param {string} cmdPayload.scope
   * @param {string} cmdPayload.type
   */
  constructor(cmdPayload) {
    const {
      name,
      value,
      scope,
      type
    } = cmdPayload;

    assert(!!name, "'name' is required");
    assert(!!value && isArray(value), "'value' is required and should be an aray");
    assert(
      !!scope && Object.values(AttributeScope).includes(scope),
      "'scope' is required and should be from 'AttributeScope'"
    );
    assert(!!type, "'type' is required");

    super(APP_CMD.CREATE_LAYOUT, cmdPayload);
  }
}

export default CreateLayoutCmd;
