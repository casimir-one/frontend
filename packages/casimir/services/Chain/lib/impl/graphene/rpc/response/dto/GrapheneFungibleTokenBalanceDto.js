import FungibleTokenBalanceDto from './../../../../../base/rpc/response/dto/FungibleTokenBalanceDto';
import { convertStringAsset } from './../utils';


class GrapheneFungibleTokenBalanceDto extends FungibleTokenBalanceDto {

  constructor(balance) {
    const account = balance.owner;
    const { id: assetId, symbol, amount, precision } = convertStringAsset(balance.amount);
    
    super({ 
      account, 
      assetId, 
      symbol, 
      amount, 
      precision 
    });
  }

}


export default GrapheneFungibleTokenBalanceDto;