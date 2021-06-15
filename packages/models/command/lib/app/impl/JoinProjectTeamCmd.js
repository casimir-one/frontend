import ProtocolCmd from './../base/ProtocolCmd';
import { APP_CMD } from './../constants';
import { assert } from '@deip/toolbox';


class JoinProjectTeamCmd extends ProtocolCmd {

  constructor(cmdPayload, txContext) {

    const {
      // onchain
      member,
      teamId,
      projectId,

      // offchain
      notes
    } = cmdPayload;

    assert(!!member, "'member' is required");
    assert(!!teamId, "'teamId' is required");
    assert(!!projectId, "'projectId' is required");

    super(APP_CMD.JOIN_PROJECT_TEAM, cmdPayload, txContext);
  }
}


export default JoinProjectTeamCmd;