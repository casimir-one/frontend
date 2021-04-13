import { assert } from '@deip/toolbox';


class BaseCmd {

  constructor(cmdNum, cmdPayload) {
    assert(!!cmdNum, "App command number is required");
    this._cmdNum = cmdNum;
    this._cmdPayload = cmdPayload;
  }

  getCmdNum() { return this._cmdNum; }
  getCmdPayload() { return this._cmdPayload; }
  isProtocolOpCmd() { throw new Error("Base command is an abstract command"); }

  serialize() { return BaseCmd.Serialize(this); }
  deserialize(serialized) { return BaseCmd.Deserialize(serialized); }

  static Serialize(cmd) {
    return JSON.stringify({
      CMD_NUM: cmd.getCmdNum(),
      CMD_PAYLOAD: cmd.getCmdPayload()
    });
  }

  static Deserialize(serialized) {
    const { CMD_NUM, CMD_PAYLOAD } = JSON.parse(serialized);
    return new BaseCmd(CMD_NUM, CMD_PAYLOAD);
  }

}


export default BaseCmd;