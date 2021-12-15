import { assert } from '@deip/toolbox';
import AppMsg from './AppMsg';
import { APP_CMD_INFO } from '@deip/command-models';


class AppMsgEnvelope {

  constructor(appMsg) {
    this._appMsg = appMsg;
  }

  unwrap() { 
    return this._appMsg;
  };
  
  serialize() {
    return AppMsgEnvelope.Serialize(this); 
  }

  deserialize(serialized, TxClass, chainMetadata) { 
    return AppMsgEnvelope.Deserialize(serialized, TxClass, chainMetadata); 
  }

  static Serialize(envelope) {
    const { tx, appCmds } = envelope.unwrap();
    return {
      PROTOCOL_CHAIN: tx ? tx.getProtocolChain() : undefined,
      MESSAGE: JSON.stringify({
        tx: tx ? tx.serialize() : undefined,
        commands: appCmds.map(cmd => cmd.serialize())
      })
    };
  }

  static Deserialize(serializedTx, TxClass, chainMetadata) {
    const { PROTOCOL_CHAIN, MESSAGE } = serializedTx;
    const msg = JSON.parse(MESSAGE);
    let tx;
    if (PROTOCOL_CHAIN) {
      assert(!!TxClass, "Chain Protocol Transaction class is not specified");
      tx = TxClass.Deserialize(msg.tx, chainMetadata);
    }
    const appCmds = msg.commands.map((cmd) => {
      const { CMD_NUM } = cmd;
      const CmdClass = APP_CMD_INFO[CMD_NUM].class;
      return CmdClass.Deserialize(cmd);
    })
    return new AppMsgEnvelope(new AppMsg({ tx, appCmds }));
  }

}


export default AppMsgEnvelope;