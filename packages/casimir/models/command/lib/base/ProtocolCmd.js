import AppCmd from './AppCmd';

/**
 * Class for protocol command
 * @extends AppCmd
 */
class ProtocolCmd extends AppCmd {
  /**
   * Is command protocol operation
   * @returns {boolean}
   */
  isProtocolOpCmd() { return ProtocolCmd.IsProtocolOpCmd(); }

  /**
   * Is command protocol operation
   * @returns {boolean}
   */
  static IsProtocolOpCmd() { return true; }

  /**
   * Serialize command
   * @returns {Object} result
   * @returns {number} result.CMD_NUM
   * @returns {string} result.CMD_PAYLOAD
   */
  serialize() { return ProtocolCmd.Serialize(this); }

  /**
   * Deserialize command
   * @param {Object} serialized
   * @returns {number} serialized.CMD_NUM
   * @returns {string} serialized.CMD_PAYLOAD
   * @returns {BaseCmd}
   */
  deserialize(serialized) { return ProtocolCmd.Deserialize(serialized); }

  /**
   * Serialize command
   * @param {ProtocolCmdClass} protocolCmd
   * @returns {Object} result
   * @returns {number} result.CMD_NUM
   * @returns {string} result.CMD_PAYLOAD
   */
  static Serialize(protocolCmd) {
    return {
      CMD_NUM: protocolCmd.getCmdNum(),
      CMD_PAYLOAD: JSON.stringify(protocolCmd.getCmdPayload())
    };
  }

  /**
   * Deserialize command
   * @param {Object} serialized
   * @returns {number} serialized.CMD_NUM
   * @returns {string} serialized.CMD_PAYLOAD
   * @returns {ProtocolCmdClass}
   */
  static Deserialize(serialized) {
    // eslint-disable-next-line global-require
    const { APP_CMD_INFO } = require('../serialization');
    const { CMD_NUM, CMD_PAYLOAD } = serialized;
    const ProtocolCmdClass = APP_CMD_INFO[CMD_NUM].class;
    return new ProtocolCmdClass(JSON.parse(CMD_PAYLOAD));
  }
}

export default ProtocolCmd;
