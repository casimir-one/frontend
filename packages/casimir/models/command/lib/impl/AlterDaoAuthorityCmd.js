import { APP_CMD } from '@casimir/platform-core';
import { assert } from '@casimir/toolbox';
import ProtocolCmd from '../base/ProtocolCmd';

/**
 * Alter DAO authority command
 * @extends ProtocolCmd
 */
class AlterDaoAuthorityCmd extends ProtocolCmd {
  /**
   * Create command for alteration DAO authority
   * @param {Object} cmdPayload
   * @param {string} cmdPayload.entityId
   * @param {Object} cmdPayload.authority
   * @param {Object} cmdPayload.authority.owner
   * @param {Array.<Object>} cmdPayload.authority.owner.auths
   * @param {string} cmdPayload.authority.owner.auths.key
   * @param {number} cmdPayload.authority.owner.auths.weight
   * @param {number} cmdPayload.authority.owner.weight
   * @param {boolean} cmdPayload.isTeamAccount
   */
  constructor(cmdPayload) {
    const {
      entityId,
      authority
    } = cmdPayload;

    assert(!!entityId, "'entityId' is required");
    assert(!!authority, "'authority' is required");

    super(APP_CMD.ALTER_DAO_AUTHORITY, cmdPayload);
  }
}

export default AlterDaoAuthorityCmd;
