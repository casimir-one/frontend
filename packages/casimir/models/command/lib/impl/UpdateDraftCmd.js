import AppCmd from '../base/AppCmd';
import { APP_CMD } from '@deip/constants';
import { assert } from '@deip/toolbox';

class UpdateDraftCmd extends AppCmd {

  constructor(cmdPayload) {

    const {
      _id: draftId
    } = cmdPayload;

    assert(!!draftId, "'draftId' is required");

    super(APP_CMD.UPDATE_DRAFT, cmdPayload);
  }

}

export default UpdateDraftCmd;
