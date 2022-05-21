import NonFungibleTokenDto from './../../../../../base/rpc/response/dto/NonFungibleTokenDto';
import { hexToBigInt } from '@polkadot/util';


class SubstrateNonFungibleTokenDto extends NonFungibleTokenDto {

  constructor(asset, metadata) {
    const classId = asset.classId;
    const owner = asset.owner;
    const admin = asset.admin;
    const issuer = asset.issuer;
    const freezer = asset.freezer;
    const totalDeposit = hexToBigInt(asset.totalDeposit).toString();
    const instancesCount = asset.instances;
    const instanceMetadatasCount = asset.instanceMetadatas;
    const attributesCount = asset.attributes;

    const name = metadata ? metadata.name : "";
    const symbol = metadata ? metadata.symbol : "";

    super({ 
      classId, 
      instancesCount, 
      instanceMetadatasCount,
      attributesCount,
      issuer, 
      symbol, 
      name,
      totalDeposit
    });

    this.owner = owner;
    this.admin = admin;
    this.freezer = freezer;
  }

}


export default SubstrateNonFungibleTokenDto;