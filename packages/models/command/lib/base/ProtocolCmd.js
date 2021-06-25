import { assert } from '@deip/toolbox';
import AppCmd from './AppCmd';


class ProtocolCmd extends AppCmd {

  constructor(cmdNum, cmdPayload) {
    super(cmdNum, cmdPayload);
  }

  isProtocolOpCmd() { return ProtocolCmd.IsProtocolOpCmd(); }
  static IsProtocolOpCmd() { return true; }

  serialize() { return ProtocolCmd.Serialize(this); }
  deserialize(serialized) { return ProtocolCmd.Deserialize(serialized); }

  static Serialize(protocolCmd) {
    return {
      CMD_NUM: protocolCmd.getCmdNum(),
      CMD_PAYLOAD: JSON.stringify(protocolCmd.getCmdPayload())
    };
  }

  static Deserialize(serialized) {
    const { APP_CMD_INFO } = require('./../serialization');
    const { CMD_NUM, CMD_PAYLOAD } = serialized;
    const ProtocolCmdClass = APP_CMD_INFO[CMD_NUM].class;
    return new ProtocolCmdClass(JSON.parse(CMD_PAYLOAD));
  }

}


export default ProtocolCmd;