import { assert } from '@deip/toolbox';


class NonFungibleTokenDto {

  constructor({
    classId,
    symbol,
    instancesCount,
    instanceMetadatasCount,
    attributesCount,
    issuer,
    totalDeposit,
    name
  }) {

    assert(!!classId, "NFT 'classId' is not specified");
    assert(!!issuer, "NFT 'issuer' is not specified");
    assert(!!instancesCount || instancesCount == 0, "NFT 'instancesCount' field is not specified");
    assert(!!instanceMetadatasCount || instanceMetadatasCount == 0, "NFT 'instanceMetadatasCount' field is not specified");
    assert(!!attributesCount || attributesCount == 0, "NFT 'attributesCount' field is not specified");
    assert(!!totalDeposit || totalDeposit == 0, "NFT 'totalDeposit' field is not specified");

    this.classId = classId;
    this.instancesCount = instancesCount;
    this.instanceMetadatasCount = instanceMetadatasCount;
    this.issuer = issuer;
    this.symbol = symbol;
    this.attributesCount = attributesCount;
    this.totalDeposit = totalDeposit;
    this.name = name || symbol;
  }

}


export default NonFungibleTokenDto;
