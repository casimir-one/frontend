import AppCmd from './../base/AppCmd';
import { APP_CMD } from '@deip/constants';
import { assert } from '@deip/toolbox';

class DeleteDocumentTemplateCmd extends AppCmd {

  constructor(cmdPayload) {

    const {
      documentTemplateId
    } = cmdPayload;

    assert(!!documentTemplateId, "'documentTemplateId' is required");

    super(APP_CMD.DELETE_DOCUMENT_TEMPLATE, cmdPayload);
  }

}

export default DeleteDocumentTemplateCmd;
