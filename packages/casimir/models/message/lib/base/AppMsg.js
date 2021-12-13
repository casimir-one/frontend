import { assert } from '@deip/toolbox';


class AppMsg {
  constructor({ tx, appCmds }) {
    assert(!!appCmds && !!appCmds.length, "Msg should contain at least 1 command");
    if (tx) {
      assert(appCmds.every((cmd => cmd.isProtocolOpCmd())), "Msg with transaction can contain chain related commands only");
    } else {
      assert(appCmds.every((cmd => !cmd.isProtocolOpCmd())), "Msg without transaction can not contain chain related commands");
    }
    this.tx = tx;
    this.appCmds = appCmds;
  }
}


export default AppMsg;