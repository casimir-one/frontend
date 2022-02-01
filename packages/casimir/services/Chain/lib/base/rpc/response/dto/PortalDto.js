import { assert } from '@deip/toolbox';


class PortalDto {

  constructor({
    portatId,
    ownerPubKey,
    verificationPubKey,
    metadata
  }) {

    assert(!!portatId, "Portal ID is not specified");
    assert(!!ownerPubKey, "Portal 'ownerPubKey' is not specified");
    assert(!!verificationPubKey, "Portal 'verificationPubKey' is not specified");

    this.portatId = portatId;
    this.ownerPubKey = ownerPubKey;
    this.verificationPubKey = verificationPubKey;
    this.metadata = metadata;
  }

}


export default PortalDto;