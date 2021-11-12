import AppCmd from './../base/AppCmd';
import { APP_CMD } from '@deip/constants';
import { assert } from '@deip/toolbox';

class UpdateLayoutCmd extends AppCmd {

  constructor(cmdPayload) {
    const layout = cmdPayload

    assert(!!layout, "'layout' is required");

    super(APP_CMD.UPDATE_LAYOUT, cmdPayload);
  }

}

export default UpdateLayoutCmd;
