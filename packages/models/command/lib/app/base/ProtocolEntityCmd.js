import ProtocolCmd from './ProtocolCmd';
import { assert } from '@deip/toolbox';


class ProtocolEntityCmd extends ProtocolCmd {

  constructor(cmdNum, cmdPayload, txContext) {
    super(cmdNum, cmdPayload, txContext);
    this._cmdPayload['entityId'] = this.getProtocolEntityId();
  }

  getProtocolEntityId() { throw new Error("Not implemented exception!"); }

}


export default ProtocolEntityCmd;