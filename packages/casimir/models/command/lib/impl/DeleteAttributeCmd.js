import AppCmd from './../base/AppCmd';
import { APP_CMD } from '@deip/constants';
import { assert } from '@deip/toolbox';

class DeleteAttributeCmd extends AppCmd {

  constructor(cmdPayload) {

    const {
      attributeId
    } = cmdPayload;

    assert(!!attributeId, "'attributeId' is required");

    super(APP_CMD.DELETE_ATTRIBUTE, cmdPayload);
  }

}

export default DeleteAttributeCmd;
