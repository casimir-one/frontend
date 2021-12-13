import { assert } from '@deip/toolbox';


class AssetBalanceDto {

  constructor({
    account,
    assetId,
    symbol,
    precision,
    amount
  }) {

    assert(!!account, "Asset balance account is not specified");
    assert(!!assetId, "Asset ID is not specified");
    assert(!!amount || amount == 0, "Asset balance amount is not specified");
    assert(!!precision || precision == 0, "Asset precision is not specified");

    this.account = account;
    this.assetId = assetId;
    this.symbol = symbol;
    this.precision = precision;
    this.amount = amount;
  }

}


export default AssetBalanceDto;
