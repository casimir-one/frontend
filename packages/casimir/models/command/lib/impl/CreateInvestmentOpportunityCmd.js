import ProtocolEntityCmd from './../base/ProtocolEntityCmd';
import { APP_CMD } from '@deip/constants';
import { assert } from '@deip/toolbox';


class CreateInvestmentOpportunityCmd extends ProtocolEntityCmd {

  constructor(cmdPayload) {

    const {
      entityId,
      teamId,
      projectId,
      startTime,
      endTime,
      shares,
      softCap,
      hardCap,
      title,
      metadata
    } = cmdPayload;

    const checkAsset = (asset, fieldName) => assert(
      !!asset
      && asset.id
      && asset.symbol
      && !isNaN(asset.precision)
      && asset.amount,
      `'${fieldName}' is required and should contains 'id', 'symbol', 'precision', 'amount' fields`
    );

    assert(!!teamId, "'teamId' is required");
    assert(!!startTime && !isNaN(startTime), "'startTime' required and should be in milliseconds");
    assert(!!endTime && !isNaN(endTime), "'endTime' required and should be in milliseconds");
    assert(new Date(endTime) > new Date(startTime), "'endTime' must be greater than 'startTime'");
    assert(!!shares && Array.isArray(shares), "'shares' is required and must be an array");
    shares.forEach(share => {
      checkAsset(share, 'share')
    })
    checkAsset(softCap, 'softCap')
    checkAsset(hardCap, 'hardCap')

    super(APP_CMD.CREATE_INVESTMENT_OPPORTUNITY, cmdPayload);
  }
}


export default CreateInvestmentOpportunityCmd;