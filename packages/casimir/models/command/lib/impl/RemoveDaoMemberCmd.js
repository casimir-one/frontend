import { APP_CMD } from '@casimir/platform-core';
import { assert, isBoolean } from '@deip/toolbox';
import ProtocolCmd from '../base/ProtocolCmd';

/**
 * Remove DAO member command
 * @extends ProtocolCmd
 */
class RemoveDaoMemberCmd extends ProtocolCmd {
  /**
   * Create command for DAO member removal
   * @param {Object} cmdPayload
   * @param {string} cmdPayload.member
   * @param {string} cmdPayload.teamId
   * @param {boolean} cmdPayload.isThresholdPreserved
   * @param {string} cmdPayload.notes
   */
  constructor(cmdPayload) {
    const {
      // onchain
      member,
      teamId,
      isThresholdPreserved,

      // offchain
      // eslint-disable-next-line no-unused-vars
      notes
    } = cmdPayload;

    assert(!!member, "'member' is required");
    assert(!!teamId, "'teamId' is required");
    assert(
      isBoolean(isThresholdPreserved),
      "'isThresholdPreserved' flag should be specified as boolean"
    );

    super(APP_CMD.REMOVE_DAO_MEMBER, cmdPayload);
  }
}

export default RemoveDaoMemberCmd;
