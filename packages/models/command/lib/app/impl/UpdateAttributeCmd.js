import AppCmd from './../base/AppCmd';
import { APP_CMD } from './../constants';
import { assert } from '@deip/toolbox';

class UpdateAttributeCmd extends AppCmd {

  constructor(cmdPayload) {

    const {
      _id: attributeId,
      title
    } = cmdPayload;

    assert(!!attributeId, "'attributeId' is required");
    assert(!!title, "'title' is required");

    super(APP_CMD.UPDATE_ATTRIBUTE, cmdPayload);
  }
  
}

export default UpdateAttributeCmd;