import AssetBalanceDto from './../../../../../base/rpc/response/dto/AssetBalanceDto';
import { fromHexFormat, addressToPubKey } from './../../../utils';


class SubstrateAssetBalanceDto extends AssetBalanceDto {

  constructor(balance, assetMetadata) {
    const assetId = fromHexFormat(balance.assetId);    
    const address = fromHexFormat(balance.account);
    const account = balance.daoId || address;
    const amount = balance.balance;
    const symbol = assetMetadata ? assetMetadata.symbol : "";
    const precision = assetMetadata ? assetMetadata.decimals : "";

    super({ 
      account, 
      assetId, 
      symbol, 
      amount, 
      precision 
    });
  }

}


export default SubstrateAssetBalanceDto;