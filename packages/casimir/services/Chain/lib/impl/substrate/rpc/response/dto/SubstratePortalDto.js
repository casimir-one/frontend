import PortalDto from './../../../../../base/rpc/response/dto/PortalDto';
import { fromHexFormat, addressToPubKey } from './../../../utils';


class SubstratePortalDto extends PortalDto {

  constructor(portal) {
    const portatId = fromHexFormat(portal.id);
    const ownerPubKey = fromHexFormat(addressToPubKey(portal.owner));
    const verificationPubKey = fromHexFormat(addressToPubKey(portal.delegate));
    const metadata = fromHexFormat(portal.metadata);

    super({
      portatId,
      ownerPubKey,
      verificationPubKey,
      metadata
    });

  }

}


export default SubstratePortalDto;