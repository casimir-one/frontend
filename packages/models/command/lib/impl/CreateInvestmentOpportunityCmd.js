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

    assert(!!teamId, "'teamId' is required");
    assert(!!startTime, "'startTime' is required");
    assert(!!endTime, "'endTime' is required");
    assert(new Date(endTime) > new Date(startTime), "'endTime' must be greater than 'startTime'");
    assert(!!shares, "'shares' is required");
    assert(!!softCap, "'softCap' is required");
    assert(!!hardCap, "'hardCap' is required");

    super(APP_CMD.CREATE_INVESTMENT_OPPORTUNITY, cmdPayload);
  }

}


export default CreateInvestmentOpportunityCmd;