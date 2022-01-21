import { assert } from '@deip/toolbox';


class FungibleTokenDto {

  constructor({
    assetId,
    symbol,
    precision,
    issuer,
    name,
    currentSupply
  }) {

    assert(!!assetId, "Asset ID is not specified");
    assert(!!issuer, "Asset issuer is not specified");
    assert(!!precision || precision == 0, "Asset precision is not specified");
    assert(!!currentSupply || currentSupply == 0, "Asset current supply is not specified");

    this.assetId = assetId;
    this.issuer = issuer;
    this.symbol = symbol;
    this.precision = precision;
    this.currentSupply = currentSupply;
    this.name = name || symbol;
  }

}


export default FungibleTokenDto;
