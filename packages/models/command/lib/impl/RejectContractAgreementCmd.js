import ProtocolCmd from '../base/ProtocolCmd';
import { APP_CMD } from '@deip/constants';
import { assert } from '@deip/toolbox';

class RejectContractAgreementCmd extends ProtocolCmd {

  constructor(cmdPayload) {

    const {
      entityId,
      party,
    } = cmdPayload;

    assert(!!entityId, "'entityId' is required");
    assert(!!party, "'party' is required");

    super(APP_CMD.REJECT_CONTRACT_AGREEMENT, cmdPayload);
  }

}

export default RejectContractAgreementCmd;
