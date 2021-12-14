import AppCmd from '../base/AppCmd';
import { APP_CMD, PROJECT_CONTENT_FORMAT } from '@deip/constants';
import { assert } from '@deip/toolbox';

class CreateDraftCmd extends AppCmd {

  constructor(cmdPayload) {

    const {
      projectId,
      formatType,
      draftId,
      jsonData
    } = cmdPayload;

    assert(!!projectId, "'projectId' is required");
    assert(!!formatType, "'formatType' is required");
    if (formatType === PROJECT_CONTENT_FORMAT.JSON) {
      assert(!!jsonData, `'jsonData' is required for ${formatType} formatType`);
    }
    assert(!!draftId, "'draftId' is required");

    super(APP_CMD.CREATE_DRAFT, cmdPayload);
  }

}

export default CreateDraftCmd;
