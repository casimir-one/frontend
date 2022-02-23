import { APP_CMD } from '@deip/constants';
import { assert, isBoolean } from '@deip/toolbox';
import ProtocolCmd from '../base/ProtocolCmd';

/**
 * Add DAO member command
 */
class AddDaoMemberCmd extends ProtocolCmd {
  /**
   * Create command for adding DAO member
   * @param {Object} cmdPayload
   * @param {string} cmdPayload.member
   * @param {string} cmdPayload.teamId
   * @param {boolean} cmdPayload.isThresholdPreserved
   * @param {*} cmdPayload.notes
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
    assert(isBoolean(isThresholdPreserved), "'isThresholdPreserved' flag should be specified as boolean");

    super(APP_CMD.ADD_DAO_MEMBER, cmdPayload);
  }
}

export default AddDaoMemberCmd;
