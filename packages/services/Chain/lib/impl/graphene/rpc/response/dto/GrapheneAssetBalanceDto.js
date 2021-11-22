import AssetBalanceDto from './../../../../../base/rpc/response/dto/AssetBalanceDto';
import { convertStringAsset } from './../utils';


class GrapheneAssetBalanceDto extends AssetBalanceDto {

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


export default GrapheneAssetBalanceDto;