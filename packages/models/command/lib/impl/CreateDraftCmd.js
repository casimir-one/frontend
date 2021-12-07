import AppCmd from '../base/AppCmd';
import { APP_CMD } from '@deip/constants';
import { assert } from '@deip/toolbox';

class CreateDraftCmd extends AppCmd {

  constructor(cmdPayload) {

    const {
      projectId,
      formatType,
      draftId
    } = cmdPayload;

    assert(!!projectId, "'projectId' is required");
    assert(!!formatType, "'formatType' is required");
    assert(!!draftId, "'draftId' is required");

    super(APP_CMD.CREATE_DRAFT, cmdPayload);
  }

}

export default CreateDraftCmd;
