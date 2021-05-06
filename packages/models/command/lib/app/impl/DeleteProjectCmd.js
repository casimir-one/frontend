import AppCmd from './../base/AppCmd';
import { APP_CMD } from './../constants';
import { assert } from '@deip/toolbox';


class DeleteProjectCmd extends AppCmd {

  constructor(cmdPayload) {

    const {
      entityId
    } = cmdPayload;

    assert(!!entityId, "'entityId' is required");

    super(APP_CMD.DELETE_PROJECT, cmdPayload);
  }
  
}


export default DeleteProjectCmd;