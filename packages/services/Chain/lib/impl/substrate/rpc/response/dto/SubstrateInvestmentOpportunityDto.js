import InvestmentOpportunityDto from './../../../../../base/rpc/response/dto/InvestmentOpportunityDto';
import { fromHexFormat } from './../../../utils';
import { TS_TYPES } from '@deip/constants';


class SubstrateInvestmentOpportunityDto extends InvestmentOpportunityDto {

  constructor(invstOpp, targetAssetDto, sharesAssetsDtos) {
    const invstOppId = fromHexFormat(invstOpp.invstOppId);
    const softCap = { amount: invstOpp.softCap, id: targetAssetDto.assetId, symbol: targetAssetDto.symbol, precision: targetAssetDto.precision };
    const hardCap = { amount: invstOpp.hardCap, id: targetAssetDto.assetId, symbol: targetAssetDto.symbol, precision: targetAssetDto.precision };
    const totalAmount = { amount: invstOpp.totalAmount, id: targetAssetDto.assetId, symbol: targetAssetDto.symbol, precision: targetAssetDto.precision };
    const shares = sharesAssetsDtos.map((shareAssetDto) => {
      const share = invstOpp.shares.find((share) => shareAssetDto.assetId === fromHexFormat(share.id));
      return { amount: share.amount, id: shareAssetDto.assetId, symbol: shareAssetDto.symbol, precision: shareAssetDto.precision };
    });
    const startTime = invstOpp.startTime;
    const endTime = invstOpp.endTime;

    let status;
    switch (invstOpp.status) {
      case 'active': {
        status = TS_TYPES.ACTIVE;
        break;
      }
      case 'finished': {
        status = TS_TYPES.FINISHED;
        break;
      }
      case 'expired': {
        status = TS_TYPES.EXPIRED;
        break;
      }
      case 'inactive': {
        status = TS_TYPES.INACTIVE;
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