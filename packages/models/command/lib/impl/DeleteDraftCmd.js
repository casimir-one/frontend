import AppCmd from './../base/AppCmd';
import { APP_CMD } from '@deip/constants';
import { assert } from '@deip/toolbox';

class DeleteDraftCmd extends AppCmd {

  constructor(cmdPayload) {

    const {
      draftId
    } = cmdPayload;

    assert(!!draftId, "'draftId' is required");

    super(APP_CMD.DELETE_DRAFT, cmdPayload);
  }

}

export default DeleteDraftCmd;
