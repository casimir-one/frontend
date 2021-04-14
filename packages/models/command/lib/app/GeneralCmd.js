import BaseCmd from './base/BaseCmd';
import { APP_CMD } from './../constants';

class GeneralCmd extends BaseCmd {

  constructor(cmdPayload) {
    super(APP_CMD.GENERAL, cmdPayload);
  }
     
}

export default GeneralCmd;