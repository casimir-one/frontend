import ProtocolCmd from './ProtocolCmd';
import { genRipemd160Hash } from '@deip/toolbox';


class ProtocolEntityCmd extends ProtocolCmd {

  constructor(cmdNum, cmdPayload) {
    super(cmdNum, cmdPayload);
    this._cmdPayload.entityId = cmdPayload.entityId 
      ? cmdPayload.entityId // Set
      : ProtocolEntityCmd.GeneraterateProtocolEntityId(cmdPayload); // Auto-Generated
  }

  getProtocolEntityId() { return this._cmdPayload.entityId; }

  static GeneraterateProtocolEntityId(payload) {
    const entityId = genRipemd160Hash({ ...payload, __timestamp: new Date().getTime() });
    return entityId;
  }
  
}


export default ProtocolEntityCmd;