import { APP_CMD, PROJECT_CONTENT_FORMAT, PROJECT_CONTENT_DRAFT_STATUS } from '@deip/constants';
import { assert } from '@deip/toolbox';
import AppCmd from '../base/AppCmd';

/**
 * Create project content draft command
 * @extends AppCmd
 */
class CreateDraftCmd extends AppCmd {
  /**
   * Create command for project content draft creation
   * @param {Object} cmdPayload
   * @param {string} cmdPayload.projectId
   * @param {Object} cmdPayload.formatType
   * @param {string} cmdPayload.draftId
   * @param {Object} cmdPayload.jsonData
   * @param {string} cmdPayload.title
   * @param {number} cmdPayload.contentType
   * @param {Array.<string>} cmdPayload.authors
   * @param {Array.<string>} cmdPayload.references
   * @param {number} cmdPayload.formatType
   * @param {Object} cmdPayload.jsonData
   * @param {Object} cmdPayload.metadata
   * @param {Object} cmdPayload.status
   */
  constructor(cmdPayload) {
    const {
      projectId,
      formatType,
      draftId,
      jsonData,
      status
    } = cmdPayload;

    assert(!!projectId, "'projectId' is required");
    assert(!!formatType, "'formatType' is required");
    assert(!!draftId, "'draftId' is required");

    if (formatType === PROJECT_CONTENT_FORMAT.JSON) {
      assert(!!jsonData, `'jsonData' is required for ${formatType} formatType`);
    }

    if (status) {
      assert(!!PROJECT_CONTENT_DRAFT_STATUS[status], "'status' is invalid");
    }

    super(APP_CMD.CREATE_DRAFT, cmdPayload);
  }
}

export default CreateDraftCmd;
