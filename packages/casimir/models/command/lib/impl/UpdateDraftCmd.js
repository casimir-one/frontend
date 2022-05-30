import { APP_CMD, PROJECT_CONTENT_FORMAT } from '@deip/constants';
import { assert } from '@deip/toolbox';
import AppCmd from '../base/AppCmd';

/**
 * Update project content draft command
 * @extends AppCmd
 */
class UpdateDraftCmd extends AppCmd {
  /**
   * Create command for project content draft update
   * @param {Object} cmdPayload
   * @param {string} cmdPayload._id
   * @param {Object} cmdPayload.formatType
   * @param {Object} cmdPayload.jsonData
   * @param {string} cmdPayload.title
   * @param {number} cmdPayload.contentType
   * @param {Array.<string>} cmdPayload.authors
   * @param {Array.<string>} cmdPayload.references
   * @param {number} cmdPayload.formatType
   * @param {Object} cmdPayload.jsonData
   * @param {Object} cmdPayload.metadata
   */
  constructor(cmdPayload) {
    const {
      _id,
      formatType,
      jsonData
    } = cmdPayload;

    assert(!!_id, "'_id' is required");
    if (formatType && formatType === PROJECT_CONTENT_FORMAT.JSON) {
      assert(!!jsonData, `'jsonData' is required for ${formatType} formatType`);
    }

    super(APP_CMD.UPDATE_DRAFT, cmdPayload);
  }
}

export default UpdateDraftCmd;
