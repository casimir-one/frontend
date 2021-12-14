import AppCmd from '../base/AppCmd';
import { APP_CMD, PROJECT_CONTENT_FORMAT } from '@deip/constants';
import { assert } from '@deip/toolbox';

class UpdateDraftCmd extends AppCmd {

  constructor(cmdPayload) {

    const {
      _id: draftId,
      formatType,
      jsonData
    } = cmdPayload;

    assert(!!draftId, "'draftId' is required");
    if (formatType && formatType === PROJECT_CONTENT_FORMAT.JSON) {
      assert(!!jsonData, `'jsonData' is required for ${formatType} formatType`);
    }

    super(APP_CMD.UPDATE_DRAFT, cmdPayload);
  }

}

export default UpdateDraftCmd;
