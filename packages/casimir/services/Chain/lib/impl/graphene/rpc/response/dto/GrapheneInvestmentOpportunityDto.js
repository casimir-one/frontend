import InvestmentOpportunityDto from './../../../../../base/rpc/response/dto/InvestmentOpportunityDto';
import { convertStringAsset } from './../utils';


class GrapheneInvestmentOpportunityDto extends InvestmentOpportunityDto {

  constructor(invstOpp) {
    const invstOppId = invstOpp.external_id;
    const softCap = convertStringAsset(invstOpp.soft_cap);
    const hardCap = convertStringAsset(invstOpp.hard_cap);
    const shares = invstOpp.security_tokens_on_sale.map((share) => convertStringAsset(share));
    const totalAmount = convertStringAsset(invstOpp.total_amount);
    const startTime = new Date(invstOpp.start_time).getTime();
    const endTime = new Date(invstOpp.end_time).getTime();
    const status = invstOpp.status;

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


export default GrapheneInvestmentOpportunityDto;