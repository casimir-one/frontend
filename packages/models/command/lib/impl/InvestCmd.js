import ProtocolCmd from './../base/ProtocolCmd';
import { APP_CMD } from '@deip/constants';
import { assert } from '@deip/toolbox';


class InvestCmd extends ProtocolCmd {

  constructor(cmdPayload) {

    const {
      investmentOpportunityId,
      investor,
      asset,
    } = cmdPayload;

    assert(!!investmentOpportunityId, "'investmentOpportunityId' is required");
    assert(!!investor, "'investor' is required");
    assert(
      !!asset
      && asset.id
      && asset.symbol
      && !isNaN(asset.precision)
      && asset.amount,
      "'asset' is required and should contains 'id', 'symbol', 'precision', 'amount' fields"
    )

    super(APP_CMD.INVEST, cmdPayload);
  }

}


export default InvestCmd;
