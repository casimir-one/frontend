import { APP_CMD } from '@deip/constants';
import { assert } from '@deip/toolbox';
import AppCmd from '../base/AppCmd';

/**
 * Update document template command
 * @extends AppCmd
 */
class UpdateDocumentTemplateCmd extends AppCmd {
  /**
   * Create command for document template creation
   * @param {Object} cmdPayload
   * @param {string} cmdPayload._id
   * @param {string} cmdPayload.title
   * @param {Object} cmdPayload.body
   */
  constructor(cmdPayload) {
    const {
      _id: documentTemplateId,
      // eslint-disable-next-line no-unused-vars
      title,
      body
    } = cmdPayload;

    assert(!!documentTemplateId, "'documentTemplateId' is required");
    assert(!!body, "'body' is required");

    super(APP_CMD.UPDATE_DOCUMENT_TEMPLATE, cmdPayload);
  }
}

export default UpdateDocumentTemplateCmd;
