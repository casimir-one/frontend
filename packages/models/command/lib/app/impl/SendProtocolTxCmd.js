import BaseCmd from './../base/BaseCmd';
import { APP_CMD, APP_CMD_INFO } from './../constants';
import { PROTOCOL_INFO } from './../../protocol/constants';
import { assert } from '@deip/toolbox';


class SendProtocolTxCmd extends BaseCmd {

  constructor(cmdPayload) {

    const {
      tx,
      commands
    } = cmdPayload;

    assert(!!tx, "Protocol transaction is not specified");
    assert(!!commands && commands.length, "Commands list should contain at least 1 command");

    super(APP_CMD.SEND_PROTOCOL_TX, cmdPayload);
  }

  getTx() { return this._cmdPayload.tx; }
  getCmds() { return this._cmdPayload.commands; }
  getProtocol() { return this._cmdPayload.tx.getProtocol(); }


  serialize() { return SendProtocolTxCmd.Serialize(this); }
  deserialize(serialized) { return SendProtocolTxCmd.Deserialize(serialized); }

  static Serialize(protocolTxCmd) {
    return {
      PROTOCOL: protocolTxCmd.getProtocol(),
      CMD_NUM: protocolTxCmd.getCmdNum(),
      CMD_PAYLOAD: JSON.stringify({
        tx: protocolTxCmd.getTx().serialize(),
        commands: protocolTxCmd.getCmds().map(cmd => cmd.serialize())
      })
    };
  }

  static Deserialize(serialized) {
    const { PROTOCOL, CMD_PAYLOAD } = serialized;
    const payload = JSON.parse(CMD_PAYLOAD);
    const TxClass = PROTOCOL_INFO[PROTOCOL].txClass;
    return new SendProtocolTxCmd({
      tx: TxClass.Deserialize(payload.tx),
      commands: payload.commands.map((cmd) => {
        const { CMD_NUM: CMD_NUM } = cmd;
        const CmdClass = APP_CMD_INFO[CMD_NUM].class;
        return CmdClass.Deserialize(cmd);
      })
    });
  }

}


export default SendProtocolTxCmd;