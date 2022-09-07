import { genRipemd160Hash } from '@casimir.one/toolbox';
import ProtocolCmd from './ProtocolCmd';

/**
 * Class for protocol entity command
 */
class ProtocolEntityCmd extends ProtocolCmd {
  /**
   * Create base command
   * @param {number} cmdNum
   * @param {Object} cmdPayload
   */
  constructor(cmdNum, cmdPayload) {
    super(cmdNum, cmdPayload);
    this._cmdPayload.entityId = cmdPayload.entityId
      ? cmdPayload.entityId // Set
      : ProtocolEntityCmd.GenerateProtocolEntityId(cmdPayload); // Auto-Generated
  }

  /**
   * Get protocol entity id
   * @returns {string} entity id
   */
  getProtocolEntityId() { return this._cmdPayload.entityId; }

  /**
   * Generate protocol entity id
   * @param {Object} payload
   * @returns {string} entity id
   */
  static GenerateProtocolEntityId(payload) {
    const entityId = genRipemd160Hash({ ...payload, __timestamp: new Date().getTime() });
    return entityId;
  }
}

export default ProtocolEntityCmd;
