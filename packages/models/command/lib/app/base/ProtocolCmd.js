import BaseCmd from './BaseCmd';
import { assert } from '@deip/toolbox';
import { APP_CMD_INFO } from './../../constants';

import { ProtocolOperationsRegistry } from '@deip/transaction-models';


class ProtocolCmd extends BaseCmd {

  constructor(cmdNum, cmdPayload, txContext = {}) {
    super(cmdNum, cmdPayload);
    this._protocolOp = ProtocolOperationsRegistry.get(cmdNum)(cmdPayload, txContext);
  }

  isProtocolOpCmd() { return true; }
  getProtocolOp() { return this._protocolOp; }

  serialize() { return ProtocolCmd.Serialize(this); }
  deserialize(serialized) { return ProtocolCmd.Deserialize(serialized); }

  static Serialize(cmd) {
    return JSON.stringify({
      PROTOCOL_OP: true,
      CMD_NUM: cmd.getCmdNum(),
      CMD_PAYLOAD: cmd.getCmdPayload()
    });
  }

  static Deserialize(serialized) {
    const { CMD_NUM, CMD_PAYLOAD } = JSON.parse(serialized);
    const getCmdInfo = (cmdNum) => { return APP_CMD_INFO[cmdNum]; }
    const cmdInfo = getCmdInfo(CMD_NUM);
    const CmdClass = cmdInfo.class;
    return new CmdClass(CMD_PAYLOAD);
  }

}


export default ProtocolCmd;