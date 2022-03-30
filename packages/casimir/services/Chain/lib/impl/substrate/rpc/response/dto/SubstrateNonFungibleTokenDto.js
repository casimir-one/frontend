import NonFungibleTokenDto from './../../../../../base/rpc/response/dto/NonFungibleTokenDto';
import { fromHexFormat } from './../../../utils';
import { hexToBigInt } from '@polkadot/util';


class SubstrateNonFungibleTokenDto extends NonFungibleTokenDto {

  constructor(asset, metadata) {
    const classId = fromHexFormat(asset.classId);
    const issuer = asset.admin;
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
  }

}


export default SubstrateNonFungibleTokenDto;