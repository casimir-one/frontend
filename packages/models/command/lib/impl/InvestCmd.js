import ProtocolCmd from './../base/ProtocolCmd';
import { APP_CMD } from '@deip/constants';
import { assert } from '@deip/toolbox';


class InvestCmd extends ProtocolCmd {

  constructor(cmdPayload) {

    const {
      tokenSaleId,
      investor,
      amount,
    } = cmdPayload;

    assert(!!tokenSaleId, "'tokenSaleId' is required");
    assert(!!investor, "'investor' is required");
    assert(!!amount, "'amount' is required");

    super(APP_CMD.INVEST, cmdPayload);
  }

}


export default InvestCmd;
