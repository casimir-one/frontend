import FungibleTokenDto from './../../../../../base/rpc/response/dto/FungibleTokenDto';
import { hexToBigInt } from '@polkadot/util';


class SubstrateFungibleTokenDto extends FungibleTokenDto {

  constructor(asset, metadata) {
    const assetId = asset.assetId;
    const owner = asset.owner;
    const admin = asset.admin;
    const issuer = asset.issuer;
    const freezer = asset.freezer;
    const currentSupply = asset.supply;
    const deposit = hexToBigInt(asset.deposit);
    const name = metadata ? metadata.name : "";
    const symbol = metadata ? metadata.symbol : "";
    const precision = metadata ? metadata.decimals : 0;
    
    super({ 
      assetId, 
      symbol, 
      precision, 
      issuer, 
      currentSupply, 
      name 
    });

    this.owner = owner;
    this.admin = admin;
    this.freezer = freezer;
    this.deposit = deposit.toString();
  }

}


export default SubstrateFungibleTokenDto;