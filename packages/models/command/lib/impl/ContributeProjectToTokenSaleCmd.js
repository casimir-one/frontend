import ProtocolCmd from './../base/ProtocolCmd';
import { APP_CMD } from './../constants';
import { assert } from '@deip/toolbox';


class ContributeProjectToTokenSaleCmd extends ProtocolCmd {

  constructor(cmdPayload) {

    const {
      tokenSaleId,
      contributor,
      amount,
    } = cmdPayload;

    assert(!!tokenSaleId, "'tokenSaleId' is required");
    assert(!!contributor, "'contributor' is required");
    assert(!!amount, "'amount' is required");

    super(APP_CMD.CONTRIBUTE_PROJECT_TOKEN_SALE, cmdPayload);
  }

}


export default ContributeProjectToTokenSaleCmd;