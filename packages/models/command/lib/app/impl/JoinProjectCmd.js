import ProtocolCmd from './../base/ProtocolCmd';
import { APP_CMD } from './../constants';
import { assert } from '@deip/toolbox';


class JoinProjectCmd extends ProtocolCmd {

  constructor(cmdPayload, txContext) {

    const {
      // onchain
      member,
      teamId,
      projectId,
      rewardShare,

      // offchain
      notes
    } = cmdPayload;

    assert(!!member, "'member' is required");
    assert(!!teamId, "'teamId' is required");
    assert(!!projectId, "'projectId' is required");

    super(APP_CMD.JOIN_PROJECT, cmdPayload, txContext);
  }
}


export default JoinProjectCmd;