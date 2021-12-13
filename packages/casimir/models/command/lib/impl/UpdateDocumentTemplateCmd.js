import AppCmd from './../base/AppCmd';
import { APP_CMD } from '@deip/constants';
import { assert } from '@deip/toolbox';

class UpdateDocumentTemplateCmd extends AppCmd {

  constructor(cmdPayload) {

    const {
      _id: documentTemplateId,
      title,
      body
    } = cmdPayload;

    assert(!!documentTemplateId, "'documentTemplateId' is required");
    assert(!!body, "'body' is required");

    super(APP_CMD.UPDATE_DOCUMENT_TEMPLATE, cmdPayload);
  }

}

export default UpdateDocumentTemplateCmd;
