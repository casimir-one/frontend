import ProtocolEntityCmd from '../base/ProtocolEntityCmd';
import { APP_CMD, CONTRACT_AGREEMENT_TYPE } from '@deip/constants';
import { assert } from '@deip/toolbox';

class CreateContractAgreementCmd extends ProtocolEntityCmd {

  constructor(cmdPayload) {

    const {
      creator,
      parties,
      hash,
      startTime,
      endTime,
      type,
      terms
    } = cmdPayload;

    assert(!!creator, "'creator' is required");
    assert(!!endTime, "'endTime' is required");
    assert(!!hash, "'hash' is required");
    assert(!!type, "'type' is required");
    assert(!!terms, "'terms' is required");
    assert(!!parties && Array.isArray(parties) && parties.length > 1, "'parties' is required");
    assert(startTime ? new Date(endTime) > new Date(startTime) : new Date(endTime) > new Date(), "'endTime' must be greater than current time or 'startTime'");

    if (type == CONTRACT_AGREEMENT_TYPE.PROJECT_LICENSE) {
      assert(!!terms.projectId, "'projectId' is required");
      assert(!!terms.fee, "'fee' is required");
    }

    super(APP_CMD.CREATE_CONTRACT_AGREEMENT, cmdPayload);
  }

}

export default CreateContractAgreementCmd;
