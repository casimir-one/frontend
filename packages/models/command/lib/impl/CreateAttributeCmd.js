import AppCmd from './../base/AppCmd';
import { APP_CMD } from '@deip/constants';
import { assert } from '@deip/toolbox';

class CreateAttributeCmd extends AppCmd {

  constructor(cmdPayload) {

    const {
      title
    } = cmdPayload;

    assert(!!title, "'title' is required");

    super(APP_CMD.CREATE_ATTRIBUTE, cmdPayload);
  }

}

export default CreateAttributeCmd;
