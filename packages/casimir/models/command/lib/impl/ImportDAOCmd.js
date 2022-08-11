import { APP_CMD } from '@casimir/platform-core';
import { assert, isBoolean } from '@casimir/toolbox';
import AppEntityCmd from '../base/AppEntityCmd';

/**
 * Create DAO command
 * @extends AppEntityCmd
 */
class ImportDAOCmd extends AppEntityCmd {
  /**
   * Create command for DAO creation
   * @param {Object} cmdPayload
   * @param {string} cmdPayload.entityId
   * @param {Object} cmdPayload.authority
   * @param {Object} cmdPayload.authority.owner
   * @param {Array.<Object>} cmdPayload.authority.owner.auths
   * @param {string} cmdPayload.authority.owner.auths.key
   * @param {number} cmdPayload.authority.owner.auths.weight
   * @param {number} cmdPayload.authority.owner.weight
   * @param {boolean} cmdPayload.isTeamAccount
   * @param {Array} cmdPayload.attributes
   */
  constructor(cmdPayload) {
    const {
      entityId,
      authority,
      isTeamAccount,
      // eslint-disable-next-line no-unused-vars
      attributes
    } = cmdPayload;

    assert(!!entityId, "'entityId' is required");
    assert(!!authority, "'authority' auths must be set");
    assert(!!authority.owner, "'owner' authority must be set");
    assert(isBoolean(isTeamAccount) && !isTeamAccount, 'Dao must belong to a user');

    super(APP_CMD.IMPORT_DAO, cmdPayload);
  }
}

export default ImportDAOCmd;
