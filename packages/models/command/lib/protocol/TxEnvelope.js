import CmdEnvelope from './../app/CmdEnvelope';
import { assert } from '@deip/toolbox';
import { APP_CMD_INFO } from './../app/constants';
import { PROTOCOL_INFO } from './constants';


class TxEnvelope extends CmdEnvelope {

  constructor(tx, appCmds) {
    super(appCmds);
    assert(!!tx, "Transaction is not specified");
    this._tx = tx;
  }

  sign(privKey) {
    this._tx.sign(privKey);
  }

  unwrap() { 
    return {
      tx: this._tx,
      ...super.unwrap()
    } 
  };

  isTxEnvelope() { return true; }

  serialize() { return TxEnvelope.Serialize(this); }
  deserialize(serialized) { return TxEnvelope.Deserialize(serialized); }

  static Serialize(envelope) {
    return {
      PROTOCOL: envelope._tx.getProtocol(),
      MESSAGE: JSON.stringify({
        tx: envelope._tx.serialize(),
        commands: envelope._appCmds.map(cmd => cmd.serialize())
      })
    };
  }

  static Deserialize(serialized) {
    const { PROTOCOL, MESSAGE } = serialized;
    const msg = JSON.parse(MESSAGE);
    const TxClass = PROTOCOL_INFO[PROTOCOL].txClass;
    const tx = TxClass.Deserialize(msg.tx);
    const appCmds = msg.commands.map((cmd) => {
      const { CMD_NUM } = cmd;
      const ProtocolCmdClass = APP_CMD_INFO[CMD_NUM].class;
      return ProtocolCmdClass.Deserialize(cmd);
    })
    return new TxEnvelope(tx, appCmds);
  }

}


export default TxEnvelope;