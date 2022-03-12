import { APP_CMD } from '@deip/constants';
import { assert } from '@deip/toolbox';
import AppCmd from '../base/AppCmd';

/**
 * Create attribute command
 * @extends AppCmd
 */
class CreateAttributeCmd extends AppCmd {
  /**
   * Create command for attribute creation
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
      title
    } = cmdPayload;

    assert(!!title, "'title' is required");

    super(APP_CMD.CREATE_ATTRIBUTE, cmdPayload);
  }
}

export default CreateAttributeCmd;
