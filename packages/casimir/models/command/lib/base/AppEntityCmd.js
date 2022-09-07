import { genRipemd160Hash } from '@casimir.one/toolbox';
import AppCmd from './AppCmd';

/**
 * Class for application command with generated id
 * @extends BaseCmd
 */
class AppEntityCmd extends AppCmd {
  /**
   * Create base command
   * @param {number} cmdNum
   * @param {Object} cmdPayload
   */
  constructor(cmdNum, cmdPayload) {
    super(cmdNum, cmdPayload);
    this._cmdPayload.entityId = cmdPayload.entityId
      ? cmdPayload.entityId // Set
      : AppEntityCmd.GenerateEntityId(cmdPayload); // Auto-Generated
  }

  /**
   * Get entity id
   * @returns {string} entity id
   */
  getEntityId() { return this._cmdPayload.entityId; }

  /**
   * Generate entity id
   * @param {Object} payload
   * @returns {string} entity id
   */
  static GenerateEntityId(payload) {
    const entityId = genRipemd160Hash({
      ...payload,
      __timestamp: new Date().getTime()
    }).slice(0, 24);
    return entityId;
  }
}

export default AppEntityCmd;
