import FungibleTokenDto from './../../../../../base/rpc/response/dto/FungibleTokenDto';
import { genRipemd160Hash } from '@deip/toolbox';


class GrapheneAssetDto extends FungibleTokenDto {
  
  constructor(asset) {
    const symbol = asset.string_symbol;
    const assetId = genRipemd160Hash(symbol); // TODO: add the hash to chain
    const precision = asset.precision;
    const issuer = asset.issuer;
    const currentSupply = asset.current_supply;
    
    super({ 
      assetId, 
      symbol, 
      precision, 
      currentSupply, 
      issuer 
    });
  }

}


export default GrapheneAssetDto;