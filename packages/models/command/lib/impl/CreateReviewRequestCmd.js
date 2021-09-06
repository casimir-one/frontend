import AppCmd from './../base/AppCmd';
import { APP_CMD } from '@deip/constants';
import { assert } from '@deip/toolbox';

class UpdateDocumentTemplateCmd extends AppCmd {

  constructor(cmdPayload) {

    const {
      projectContentId,
      expert
    } = cmdPayload;

    assert(!!projectContentId, "'projectContentId' is required");
    assert(!!expert, "'expert' is required");

    super(APP_CMD.CREATE_REVIEW_REQUEST, cmdPayload);
  }

}

export default UpdateDocumentTemplateCmd;
