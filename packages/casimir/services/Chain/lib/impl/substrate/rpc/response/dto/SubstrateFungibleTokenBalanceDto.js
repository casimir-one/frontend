import FungibleTokenBalanceDto from './../../../../../base/rpc/response/dto/FungibleTokenBalanceDto';
import { fromHexFormat } from './../../../utils';


class SubstrateFungibleTokenBalanceDto extends FungibleTokenBalanceDto {

  constructor(balance, assetMetadata) {
    const assetId = balance.assetId;    
    const address = fromHexFormat(balance.account);
    const account = balance.daoId || address;
    const amount = balance.balance;
    const symbol = assetMetadata ? assetMetadata.symbol : "";
    const precision = assetMetadata ? assetMetadata.decimals : "";
    const isFrozen = balance.isFrozen || false;

    super({ 
      account, 
      assetId, 
      symbol, 
      amount, 
      precision 
    });

    this.isFrozen = isFrozen;
  }

}


export default SubstrateFungibleTokenBalanceDto;