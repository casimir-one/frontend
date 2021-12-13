import { assert } from '@deip/toolbox';
import { APP_CMD } from '@deip/constants';

class BaseCmd {

  constructor(cmdNum, cmdPayload) {
    assert(!!cmdNum, "App command number is required");
    this._cmdNum = cmdNum;
    this._cmdPayload = cmdPayload;
  }

  getCmdNum() { return this._cmdNum; }
  getCmdName() { return APP_CMD[this._cmdNum]; }

  getCmdPayload() { return this._cmdPayload; }

  isProtocolOpCmd() { return BaseCmd.IsProtocolOpCmd() };
  static IsProtocolOpCmd() { return false };

  serialize() { return BaseCmd.Serialize(this); }
  deserialize(serialized) { return BaseCmd.Deserialize(serialized); }

  static Serialize(cmd) {
    return {
      CMD_NUM: cmd.getCmdNum(),
      CMD_PAYLOAD: JSON.stringify(cmd.getCmdPayload())
    };
  }

  static Deserialize(serialized) {
    const { APP_CMD_INFO } = require('./../serialization');
    const { CMD_NUM, CMD_PAYLOAD } = serialized;
    const CmdClass = APP_CMD_INFO[CMD_NUM].class;
    return new CmdClass(JSON.parse(CMD_PAYLOAD));
  }

}


export default BaseCmd;
