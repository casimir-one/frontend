import ProtocolCmd from '../base/ProtocolCmd';
import { APP_CMD } from '@deip/constants';
import { assert } from '@deip/toolbox';

class AcceptContractAgreementCmd extends ProtocolCmd {

  constructor(cmdPayload) {

    const {
      entityId,
      party,
    } = cmdPayload;

    assert(!!entityId, "'entityId' is required");
    assert(!!party, "'party' is required");

    super(APP_CMD.ACCEPT_CONTRACT_AGREEMENT, cmdPayload);
  }

}

export default AcceptContractAgreementCmd;
