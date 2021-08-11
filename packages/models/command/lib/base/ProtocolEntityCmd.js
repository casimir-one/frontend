import ProtocolCmd from './ProtocolCmd';
import { assert } from '@deip/toolbox';
import crypto from '@deip/lib-crypto';


class ProtocolEntityCmd extends ProtocolCmd {

  constructor(cmdNum, cmdPayload) {
    super(cmdNum, cmdPayload);
    this._cmdPayload.entityId = cmdPayload.entityId 
      ? cmdPayload.entityId // Set
      : ProtocolEntityCmd.GeneraterateProtocolEntityId(cmdPayload); // Auto-Generated
  }

  getProtocolEntityId() { return this._cmdPayload.entityId; }

  static GeneraterateProtocolEntityId(payload) {
    const entityId = crypto.hexify(crypto.ripemd160(new TextEncoder('utf-8').encode(JSON.stringify({ ...payload, __timestamp: new Date().getTime() })).buffer));
    return entityId;
  }
  
}


export default ProtocolEntityCmd;