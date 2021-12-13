import AppCmd from './../base/AppCmd';
import { APP_CMD } from '@deip/constants';
import { assert } from '@deip/toolbox';

class CreateDocumentTemplateCmd extends AppCmd {

  constructor(cmdPayload) {

    const {
      account,
      title,
      body
    } = cmdPayload;

    assert(!!account, "'account' is required");
    assert(!!body, "'body' is required");

    super(APP_CMD.CREATE_DOCUMENT_TEMPLATE, cmdPayload);
  }

}

export default CreateDocumentTemplateCmd;
