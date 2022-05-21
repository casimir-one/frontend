import { assert, isNumber, isString } from '@deip/toolbox';


class FungibleTokenDto {

  constructor({
    assetId,
    symbol,
    precision,
    issuer,
    name,
    currentSupply
  }) {

    assert(isNumber(assetId) || isString(assetId), "Asset ID is not specified");
    assert(!!issuer, "Asset issuer is not specified");
    assert(isNumber(precision) || isString(precision), "Asset precision is not specified");

    this.assetId = assetId;
    this.issuer = issuer;
    this.symbol = symbol;
    this.precision = precision;
    this.currentSupply = currentSupply;
    this.name = name || symbol;
  }

}


export default FungibleTokenDto;
