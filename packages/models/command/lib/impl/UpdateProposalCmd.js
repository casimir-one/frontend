import ProtocolCmd from './../base/ProtocolCmd';
import { APP_CMD } from '@deip/constants';
import { assert } from '@deip/toolbox';


class UpdateProposalCmd extends ProtocolCmd {

  constructor(cmdPayload) {

    const {
      // onchain
      entityId,
      activeApprovalsToAdd,
      activeApprovalsToRemove,
      ownerApprovalsToAdd,
      ownerApprovalsToRemove,
      keyApprovalsToAdd,
      keyApprovalsToRemove
    } = cmdPayload;

    assert(!!entityId, "'entityId' is required");
    assert(!!activeApprovalsToAdd || !!activeApprovalsToRemove || !!ownerApprovalsToAdd || !!ownerApprovalsToRemove || !!keyApprovalsToAdd || !!keyApprovalsToRemove, "Proposal update data is required");
    assert(!!activeApprovalsToAdd.length || !!activeApprovalsToRemove.length || !!ownerApprovalsToAdd.length || !!ownerApprovalsToRemove.length || !!keyApprovalsToAdd.length || !!keyApprovalsToRemove.length, "Proposal update data is required");

    super(APP_CMD.UPDATE_PROPOSAL, cmdPayload);
  }
}


export default UpdateProposalCmd;
