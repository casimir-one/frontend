import { INVESTMENT_OPPORTUNITY_STATUS } from '@deip/constants';
import InvestmentOpportunityDto from '../../../../../base/rpc/response/dto/InvestmentOpportunityDto';
import { fromHexFormat } from '../../../utils';

class SubstrateInvestmentOpportunityDto extends InvestmentOpportunityDto {
  constructor(invstOpp, targetAssetDto, sharesAssetsDtos) {
    const invstOppId = fromHexFormat(invstOpp.invstOppId);
    const softCap = {
      amount: invstOpp.softCap, id: targetAssetDto.assetId, symbol: targetAssetDto.symbol, precision: targetAssetDto.precision
    };
    const hardCap = {
      amount: invstOpp.hardCap, id: targetAssetDto.assetId, symbol: targetAssetDto.symbol, precision: targetAssetDto.precision
    };
    const totalAmount = {
      amount: invstOpp.totalAmount, id: targetAssetDto.assetId, symbol: targetAssetDto.symbol, precision: targetAssetDto.precision
    };
    const shares = sharesAssetsDtos.map((shareAssetDto) => {
      const share = invstOpp.shares.find((share) => shareAssetDto.assetId === fromHexFormat(share.id));
      return {
        amount: share.amount, id: shareAssetDto.assetId, symbol: shareAssetDto.symbol, precision: shareAssetDto.precision
      };
    });
    const { startTime } = invstOpp;
    const { endTime } = invstOpp;

    let status;
    switch (invstOpp.status) {
      case 'active': {
        status = INVESTMENT_OPPORTUNITY_STATUS.ACTIVE;
        break;
      }
      case 'finished': {
        status = INVESTMENT_OPPORTUNITY_STATUS.FINISHED;
        break;
      }
      case 'expired': {
        status = INVESTMENT_OPPORTUNITY_STATUS.EXPIRED;
        break;
      }
      case 'inactive': {
        status = INVESTMENT_OPPORTUNITY_STATUS.INACTIVE;
        break;
      }
      default: {
        throw new Error(`Unknown Investment Opportunity status: ${invstOpp.status}`);
      }
    }

    super({
      invstOppId,
      softCap,
      hardCap,
      shares,
      totalAmount,
      startTime,
      endTime,
      status
    });
  }
}

export default SubstrateInvestmentOpportunityDto;
