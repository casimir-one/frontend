import AppCmd from './../base/AppCmd';
import { APP_CMD } from '@deip/constants';
import { assert, isArray } from '@deip/toolbox';

class UpdateLayoutCmd extends AppCmd {

  constructor(cmdPayload) {
    const {
      _id: layoutId,
      name,
      value
    } = cmdPayload

    assert(!!layoutId, "'layoutId' is required");
    assert(!!name, "'name' is required");
    assert(!!value && isArray(value), "'value' is required and should be an aray");

    super(APP_CMD.UPDATE_LAYOUT, cmdPayload);
  }

}

export default UpdateLayoutCmd;
