import CmdEnvelope from './CmdEnvelope';
import { assert } from '@deip/toolbox';
import { APP_PROTOCOL_CHAIN_INFO, APP_CMD_INFO } from '@deip/command-models';


class TxEnvelope extends CmdEnvelope {

  constructor({ tx, appCmds }) {
    assert(!!tx, "Transaction is not specified");
    assert(appCmds.every((cmd => cmd.isProtocolOpCmd())), "Envelope can contain protocol chain related commands only");

    super({ appCmds }, true);
    this._tx = tx;
  }

  unwrap() { 
    return {
      tx: this._tx,
      ...super.unwrap()
    } 
  };

  serialize() { return TxEnvelope.Serialize(this); }
  deserialize(serialized) { return TxEnvelope.Deserialize(serialized); }

  static Serialize(envelope) {
    const { tx, appCmds } = envelope.unwrap();
    return {
      PROTOCOL: tx.getProtocolChain(),
      MESSAGE: JSON.stringify({
        tx: tx.serialize(),
        commands: appCmds.map(cmd => cmd.serialize())
      })
    };
  }

  static Deserialize(serialized) {
    const { PROTOCOL, MESSAGE } = serialized;
    const msg = JSON.parse(MESSAGE);
    const TxClass = APP_PROTOCOL_CHAIN_INFO[PROTOCOL].txClass;
    const tx = TxClass.Deserialize(msg.tx);
    const appCmds = msg.commands.map((cmd) => {
      const { CMD_NUM } = cmd;
      const ProtocolCmdClass = APP_CMD_INFO[CMD_NUM].class;
      return ProtocolCmdClass.Deserialize(cmd);
    })
    return new TxEnvelope({ tx, appCmds });
  }

}


export default TxEnvelope;