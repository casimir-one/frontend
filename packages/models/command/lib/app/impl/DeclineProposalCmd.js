import ProtocolCmd from './../base/ProtocolCmd';
import { APP_CMD } from './../constants';
import { assert } from '@deip/toolbox';


class DeclineProposalCmd extends ProtocolCmd {

  constructor(cmdPayload, txContext) {

    const {
      // onchain
      entityId,
      account,
      authorityType
    } = cmdPayload;

    assert(!!entityId, "'entityId' is required");
    assert(!!account, "'account' is required");
    assert(!!authorityType, "'authorityType' is required");

    super(APP_CMD.DECLINE_PROPOSAL, cmdPayload, txContext);
  }
}


export default DeclineProposalCmd;