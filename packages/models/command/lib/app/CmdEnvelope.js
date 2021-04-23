import { assert } from '@deip/toolbox';
import { APP_CMD_INFO } from './constants';


class CmdEnvelope {
  constructor(appCmds) {
    assert(!!appCmds && !!appCmds.length, "Commands list should contain at least 1 command");

    if (this.isTxEnvelope()) {
      assert(appCmds.every((cmd => cmd.isProtocolOpCmd())), "Envelope can contain protocol related commands only");
    } else {
      assert(appCmds.every((cmd => !cmd.isProtocolOpCmd())), "Envelope can contain app general commands only");
    }

    this._appCmds = appCmds;
  }

  isTxEnvelope() { return false; }

  unwrap() {
    return {
      appCmds: this._appCmds
    }
  };

  serialize() { return CmdEnvelope.Serialize(this); }
  deserialize(serialized) { return CmdEnvelope.Deserialize(serialized); }

  static Serialize(envelope) {
    return {
      MESSAGE: JSON.stringify({
        commands: envelope._appCmds.map(cmd => cmd.serialize())
      })
    };
  }

  static Deserialize(serialized) {
    const { MESSAGE } = serialized;
    const msg = JSON.parse(MESSAGE);
    const appCmds = msg.commands.map((cmd) => {
      const { CMD_NUM } = cmd;
      const CmdClass = APP_CMD_INFO[CMD_NUM].class;
      return CmdClass.Deserialize(cmd);
    })
    return new CmdEnvelope(appCmds);
  }
}


export default CmdEnvelope;