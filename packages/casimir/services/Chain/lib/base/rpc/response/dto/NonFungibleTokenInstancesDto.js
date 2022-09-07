import { assert } from '@casimir.one/toolbox';


class NonFungibleTokenInstancesDto {

  constructor({
    account,
    classId,
    instancesIds,
    symbol,
  }) {

    assert(!!account, "Account is not specified");
    assert(!!classId, "Class ID is not specified");
    assert(!!instancesIds, "Asset precision is not specified");

    this.account = account;
    this.nftCollectionId = classId;
    this.nftItemsIds = instancesIds;
    this.symbol = symbol;
  }

}


export default NonFungibleTokenInstancesDto;