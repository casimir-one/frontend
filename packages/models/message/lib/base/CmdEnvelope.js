import { assert } from '@deip/toolbox';
import { APP_CMD_INFO } from '@deip/command-models';


class CmdEnvelope {
  constructor({ appCmds }, isTx = false) {
    assert(!!appCmds && !!appCmds.length, "Commands list should contain at least 1 command");

    if (isTx) {
      assert(appCmds.every((cmd => cmd.isProtocolOpCmd())), "Msg can contain protocol chain related commands only");
    } else {
      assert(appCmds.every((cmd => !cmd.isProtocolOpCmd())), "Msg can not contain protocol chain related commands");
    }

    this._appCmds = appCmds;
  }

  unwrap() {
    return {
      appCmds: this._appCmds
    }
  };

  serialize() { return CmdEnvelope.Serialize(this); }
  deserialize(serialized) { return CmdEnvelope.Deserialize(serialized); }

  static Serialize(envelope) {
    const { appCmds } = envelope.unwrap();
    return {
      MESSAGE: JSON.stringify({
        commands: appCmds.map(cmd => cmd.serialize())
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
    return new CmdEnvelope({ appCmds });
  }
}


export default CmdEnvelope;