import ProtocolEntityCmd from '../base/ProtocolEntityCmd';
import { APP_CMD, CONTRACT_AGREEMENT_TYPE } from '@deip/constants';
import { assert } from '@deip/toolbox';

class CreateContractAgreementCmd extends ProtocolEntityCmd {

  constructor(cmdPayload) {

    const {
      creator,
      parties,
      hash,
      activationTime,
      expirationTime,
      type,
      terms
    } = cmdPayload;

    assert(!!creator, "'creator' is required");
    assert(!!hash, "'hash' is required");
    assert(!!type, "'type' is required");
    assert(!!terms, "'terms' is required");
    assert(!!parties && Array.isArray(parties) && parties.length > 1, "'parties' is required");

    if (expirationTime && activationTime) {
      assert(new Date(expirationTime) > new Date(activationTime), "'expirationTime' must be greater than 'activationTime'");
    } else if (expirationTime) {
      assert(new Date(expirationTime) > new Date(), "'expirationTime' must be greater than current time"); 
    } else if (activationTime) {
      assert(new Date(activationTime) > new Date(), "'activationTime' must be greater than current time");
    }

    if (type == CONTRACT_AGREEMENT_TYPE.PROJECT_LICENSE) {
      assert(!!terms.projectId, "'projectId' is required");
      assert(!!terms.price, "'price' is required");
    }

    super(APP_CMD.CREATE_CONTRACT_AGREEMENT, cmdPayload);
  }

}

export default CreateContractAgreementCmd;
