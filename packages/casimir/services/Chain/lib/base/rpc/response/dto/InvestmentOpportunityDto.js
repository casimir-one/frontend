import { assert } from '@casimir/toolbox';
import { isValidAssetFormat, isValidTimestampFormat } from './../utils';


class InvestmentOpportunityDto {

  constructor({
    invstOppId,
    shares,
    softCap,
    hardCap,
    totalAmount,
    status,
    startTime,
    endTime
  }) {
    
    assert(!!invstOppId, "Investment Opportunity ID is not specified");
    assert(isValidAssetFormat(softCap), "Soft Cap is required and should be specified in format { 'id', 'symbol', 'precision', 'amount' }");
    assert(isValidAssetFormat(hardCap), "Hard Cap is required and should be specified in format { 'id', 'symbol', 'precision', 'amount' }");
    assert(!shares.length || shares.every(share => isValidAssetFormat(share)), "Shares should be specified in format { 'id', 'symbol', 'precision', 'amount' }");
    assert(isValidAssetFormat(totalAmount), "Total amount should be specified in format { 'id', 'symbol', 'precision', 'amount' }");
    assert(isValidTimestampFormat(startTime), "Start Time is not specified");
    assert(isValidTimestampFormat(endTime), "Start Time is not specified");
    assert(!!status, "Status is not specified");

    this.invstOppId = invstOppId;
    this.shares = shares;
    this.softCap = softCap;
    this.hardCap = hardCap;
    this.totalAmount = totalAmount;
    this.status = status;
    this.startTime = startTime;
    this.endTime = endTime;
  }

}


export default InvestmentOpportunityDto;
