import NonFungibleTokenInstancesDto from './../../../../../base/rpc/response/dto/NonFungibleTokenInstancesDto';
import { fromHexFormat } from './../../../utils';


class SubstrateNonFungibleTokenInstancesDto extends NonFungibleTokenInstancesDto {

  constructor(balance, nftMetadata) {
    const classId = fromHexFormat(balance.classId);    
    const address = fromHexFormat(balance.account);
    const account = balance.daoId || address;
    const instancesIds = balance.instancesIds || [];
    const symbol = nftMetadata ? nftMetadata.symbol : "";

    super({
      account, 
      classId, 
      instancesIds,
      symbol,
    });
  }

}


export default SubstrateNonFungibleTokenInstancesDto;