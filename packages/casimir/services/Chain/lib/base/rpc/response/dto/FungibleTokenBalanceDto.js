import { assert, isNumber, isString } from '@deip/toolbox';


class FungibleTokenBalanceDto {

  constructor({
    account,
    assetId,
    symbol,
    precision,
    amount
  }) {

    assert(!!account, "Asset balance account is not specified");
    assert(isNumber(assetId) || isString(assetId), "Asset ID is not specified");
    assert(isNumber(amount) || isString(amount), "Asset balance amount is not specified");
    assert(isNumber(precision), "Asset precision is not specified");

    this.account = account;
    this.assetId = assetId;
    this.symbol = symbol;
    this.precision = precision;
    this.amount = amount;
  }

}


export default FungibleTokenBalanceDto;
