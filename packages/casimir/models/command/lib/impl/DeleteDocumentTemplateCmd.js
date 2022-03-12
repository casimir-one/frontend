import { APP_CMD } from '@deip/constants';
import { assert } from '@deip/toolbox';
import AppCmd from '../base/AppCmd';

/**
 * Delete document template command
 * @extends AppCmd
 */
class DeleteDocumentTemplateCmd extends AppCmd {
  /**
   * Create command for document template delition
   * @param {Object} cmdPayload
   * @param {Ostringbject} cmdPayload.documentTemplateId
   */
  constructor(cmdPayload) {
    const {
      documentTemplateId
    } = cmdPayload;

    assert(!!documentTemplateId, "'documentTemplateId' is required");

    super(APP_CMD.DELETE_DOCUMENT_TEMPLATE, cmdPayload);
  }
}

export default DeleteDocumentTemplateCmd;
