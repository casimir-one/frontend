import ProtocolCmd from '../base/ProtocolCmd';
import { APP_CMD } from '@deip/constants';
import { assert } from '@deip/toolbox';


class LeaveTeamCmd extends ProtocolCmd {

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

    super(APP_CMD.LEAVE_TEAM, cmdPayload);
  }
}


export default LeaveTeamCmd;
