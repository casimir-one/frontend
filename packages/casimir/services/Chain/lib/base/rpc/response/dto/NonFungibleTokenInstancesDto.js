import { assert } from '@deip/toolbox';


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
    this.classId = classId;
    this.instancesIds = instancesIds;
    this.symbol = symbol;
  }

}


export default NonFungibleTokenInstancesDto;