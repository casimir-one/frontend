import { APP_CMD } from '@casimir.one/platform-core';
import { assert, isBoolean } from '@casimir.one/toolbox';
import ProtocolCmd from '../base/ProtocolCmd';

/**
 * Update DAO command
 * @extends ProtocolCmd
 */
class UpdateDaoCmd extends ProtocolCmd {
  /**
   * Create command for DAO update
   * @param {Object} cmdPayload
   * @param {string} cmdPayload.entityId
   * @param {string} cmdPayload.description
   * @param {boolean} cmdPayload.isTeamAccount
   * @param {Array} cmdPayload.attributes
   */
  constructor(cmdPayload) {
    const {
      // onchain
      entityId,
      description,

      // offchain
      isTeamAccount,
      // eslint-disable-next-line no-unused-vars
      attributes
    } = cmdPayload;

    assert(!!description, "'description' is required");
    assert(!!entityId, "'entityId' is required");
    assert(isBoolean(isTeamAccount), 'Account must belong to a team or user');

    super(APP_CMD.UPDATE_DAO, cmdPayload);
  }
}

export default UpdateDaoCmd;
