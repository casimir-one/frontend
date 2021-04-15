import { assert } from '@deip/toolbox';
import BaseCmd from './BaseCmd';
import { APP_CMD_INFO } from './../constants';
import { ProtocolRegistry } from './../../protocol/registry';


class ProtocolCmd extends BaseCmd {

  constructor(cmdNum, cmdPayload, txContext) {
    assert(!!txContext && txContext.protocol, "Protocol must be specified for protocol related command");
    super(cmdNum, cmdPayload);
    const protocolRegistry = new ProtocolRegistry(txContext.protocol);
    const opRegistry = protocolRegistry.getOperationsRegistry();
    this._protocol = txContext.protocol;
    this._protocolOp = opRegistry.get(cmdNum)(cmdPayload, txContext);
  }

  isProtocolOpCmd() { return true; }

  getProtocol() { return this._protocol; }
  getProtocolOp() { return this._protocolOp; }

  serialize() { return ProtocolCmd.Serialize(this); }
  deserialize(serialized) { return ProtocolCmd.Deserialize(serialized); }

  static Serialize(protocolCmd) {
    return {
      PROTOCOL: protocolCmd.getProtocol(),
      CMD_NUM: protocolCmd.getCmdNum(),
      CMD_PAYLOAD: JSON.stringify(protocolCmd.getCmdPayload())
    };
  }

  static Deserialize(serialized) {
    const { CMD_NUM, CMD_PAYLOAD, PROTOCOL } = serialized;
    const ProtocolCmdClass = APP_CMD_INFO[CMD_NUM].class;
    return new ProtocolCmdClass(JSON.parse(CMD_PAYLOAD), { protocol: PROTOCOL });
  }

}


export default ProtocolCmd;