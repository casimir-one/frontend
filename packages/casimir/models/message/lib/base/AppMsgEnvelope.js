import { assert } from '@casimir/toolbox';
import { APP_CMD_INFO } from '@casimir/commands';
import AppMsg from './AppMsg';

/**
 * App message envelope
 */
class AppMsgEnvelope {
  /**
   * Create app message envelope
   * @param {AppMsg} appMsg
   */
  constructor(appMsg) {
    this._appMsg = appMsg;
  }

  /**
   * Get app message
   * @returns {AppMsg} app message
   */
  unwrap() {
    return this._appMsg;
  }

  /**
   * Serialize app message envelope
   * @returns {Object}
   */
  serialize() {
    return AppMsgEnvelope.Serialize(this);
  }

  /**
   * Deserialize app message envelope
   * @param {Object} serialized
   * @param {Object} serialized.PROTOCOL_CHAIN
   * @param {string} serialized.MESSAGE
   * @param {*} TxClass
   * @param {*} chainMetadata
   * @returns {AppMsgEnvelope}
   */
  deserialize(serialized, TxClass, chainMetadata) {
    return AppMsgEnvelope.Deserialize(serialized, TxClass, chainMetadata);
  }

  /**
   * Serialize app message envelope
   * @param {AppMsgEnvelope} envelope
   * @returns {Object} result
   * @returns {Object} result.PROTOCOL_CHAIN
   * @returns {string} result.MESSAGE
   * @static
   */
  static Serialize(envelope) {
    const { tx, appCmds } = envelope.unwrap();
    return {
      PROTOCOL_CHAIN: tx ? tx.getProtocolChain() : undefined,
      MESSAGE: JSON.stringify({
        tx: tx ? tx.serialize() : undefined,
        commands: appCmds.map((cmd) => cmd.serialize())
      })
    };
  }

  /**
   * Deserialize app message envelope
   * @param {Object} serializedTx
   * @param {Object} serializedTx.PROTOCOL_CHAIN
   * @param {string} serializedTx.MESSAGE
   * @param {*} TxClass
   * @param {*} chainMetadata
   * @returns {AppMsgEnvelope}
   * @static
   */
  static Deserialize(serializedTx, TxClass, chainMetadata) {
    const { PROTOCOL_CHAIN, MESSAGE } = serializedTx;
    const msg = JSON.parse(MESSAGE);
    let tx;
    if (PROTOCOL_CHAIN) {
      assert(!!TxClass, 'Chain Protocol Transaction class is not specified');
      tx = TxClass.Deserialize(msg.tx, chainMetadata);
    }
    const appCmds = msg.commands.map((cmd) => {
      const { CMD_NUM } = cmd;
      const CmdClass = APP_CMD_INFO[CMD_NUM].class;
      return CmdClass.Deserialize(cmd);
    });
    return new AppMsgEnvelope(new AppMsg({ tx, appCmds }));
  }
}

export default AppMsgEnvelope;
