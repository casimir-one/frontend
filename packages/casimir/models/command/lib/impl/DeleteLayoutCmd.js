import AppCmd from '../base/AppCmd';
import { APP_CMD } from '@deip/constants';
import { assert } from '@deip/toolbox';

class DeleteLayoutCmd extends AppCmd {

  constructor(cmdPayload) {
    const {
      layoutId
    } = cmdPayload

    assert(!!layoutId, "'layoutId' is required");

    super(APP_CMD.DELETE_LAYOUT, cmdPayload);
  }

}

export default DeleteLayoutCmd;
