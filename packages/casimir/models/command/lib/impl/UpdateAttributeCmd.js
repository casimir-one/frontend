import { APP_CMD } from '@casimir/platform-core';
import { assert } from '@deip/toolbox';
import AppCmd from '../base/AppCmd';

/**
 * Update attribute command
 * @extends AppCmd
 */
class UpdateAttributeCmd extends AppCmd {
  /**
   * Create command for attribute update
   * @param {Object} cmdPayload
   * @param {string} cmdPayload.type
   * @param {string} cmdPayload.scope
   * @param {string} cmdPayload.title
   * @param {string} cmdPayload.shortTitle
   * @param {string} cmdPayload.description
   * @param {*} cmdPayload.defaultValue
   * @param {Array} cmdPayload.valueOptions
   * @param {boolean} cmdPayload.isEditable
   * @param {boolean} cmdPayload.isHidden
   * @param {boolean} cmdPayload.isMultiple
   * @param {boolean} cmdPayload.isRequired
   * @param {boolean} cmdPayload.isSystem
   * @param {Object} cmdPayload.schemas
   * @param {string} cmdPayload.portalId
   * @param {*} cmdPayload.blockchainFieldMeta
   */
  constructor(cmdPayload) {
    const {
      _id: attributeId,
      title
    } = cmdPayload;

    assert(!!attributeId, "'attributeId' is required");
    assert(!!title, "'title' is required");

    super(APP_CMD.UPDATE_ATTRIBUTE, cmdPayload);
  }
}

export default UpdateAttributeCmd;
