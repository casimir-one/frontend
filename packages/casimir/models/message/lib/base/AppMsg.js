import { assert } from '@casimir.one/toolbox';

/**
 * App message
 */
class AppMsg {
  /**
   * Create app message
   * @param {Object} message
   * @param {import("@casimir.one/chain-service").BaseTx} message.tx transaction
   * @param {Array} message.appCmds commands
   */
  constructor(message) {
    const { tx, appCmds } = message;
    assert(!!appCmds && !!appCmds.length, 'Msg should contain at least 1 command');
    if (tx) {
      assert(
        appCmds.every(((cmd) => cmd.isProtocolOpCmd())),
        'Msg with transaction can contain chain related commands only'
      );
    } else {
      assert(
        appCmds.every(((cmd) => !cmd.isProtocolOpCmd())),
        'Msg without transaction can not contain chain related commands'
      );
    }
    this.tx = tx;
    this.appCmds = appCmds;
  }
}

export default AppMsg;
