import ProtocolCmd from '../base/ProtocolCmd';
import { APP_CMD } from '@deip/constants';
import { assert, isBoolean } from '@deip/toolbox';


class RemoveDaoMemberCmd extends ProtocolCmd {

  constructor(cmdPayload) {

    const {
      // onchain
      member,
      teamId,
      isThresholdPreserved,

      // offchain
      notes
    } = cmdPayload;

    assert(!!member, "'member' is required");
    assert(!!teamId, "'teamId' is required");
    assert(isBoolean(isThresholdPreserved), "'isThresholdPreserved' flag should be specified as boolean");

    super(APP_CMD.REMOVE_DAO_MEMBER, cmdPayload);
  }
}


export default RemoveDaoMemberCmd;
