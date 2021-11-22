import ProtocolCmd from '../base/ProtocolCmd';
import { APP_CMD } from '@deip/constants';
import { assert } from '@deip/toolbox';


class RemoveDaoMemberCmd extends ProtocolCmd {

  constructor(cmdPayload) {

    const {
      // onchain
      member,
      teamId,

      // offchain
      notes
    } = cmdPayload;

    assert(!!member, "'member' is required");
    assert(!!teamId, "'teamId' is required");

    super(APP_CMD.REMOVE_DAO_MEMBER, cmdPayload);
  }
}


export default RemoveDaoMemberCmd;
