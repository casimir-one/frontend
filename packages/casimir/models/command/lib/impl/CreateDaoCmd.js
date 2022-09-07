import { APP_CMD } from '@casimir.one/platform-core';
import { assert, isBoolean } from '@casimir.one/toolbox';
import ProtocolEntityCmd from '../base/ProtocolEntityCmd';

/**
 * Create DAO command
 * @extends ProtocolEntityCmd
 */
class CreateDaoCmd extends ProtocolEntityCmd {
  /**
   * Create command for DAO creation
   * @param {Object} cmdPayload
   * @param {string} cmdPayload.entityId
   * @param {string} cmdPayload.creator
   * @param {Object} cmdPayload.authority
   * @param {Object} cmdPayload.authority.owner
   * @param {Array.<Object>} cmdPayload.authority.owner.auths
   * @param {string} cmdPayload.authority.owner.auths.key
   * @param {number} cmdPayload.authority.owner.auths.weight
   * @param {number} cmdPayload.authority.owner.weight
   * @param {string} cmdPayload.description
   * @param {boolean} cmdPayload.isTeamAccount
   * @param {Array} cmdPayload.attributes
   */
  constructor(cmdPayload) {
    const {
      // onchain
      // eslint-disable-next-line no-unused-vars
      entityId,
      creator,
      authority,
      description,

      // offchain
      isTeamAccount,
      // eslint-disable-next-line no-unused-vars
      attributes
    } = cmdPayload;

    assert(!!creator, "'creator' is required");
    assert(!!description, "'description' is required");
    assert(!!authority, "'authority' auths must be set");
    assert(!!authority.owner, "'owner' authority must be set");
    assert(isBoolean(isTeamAccount), 'Account must belong to a team or user');

    super(APP_CMD.CREATE_DAO, cmdPayload);
  }
}

export default CreateDaoCmd;
