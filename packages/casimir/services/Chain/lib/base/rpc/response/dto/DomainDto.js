import { assert } from '@deip/toolbox';


class DomainDto {

  constructor({
    domainId,
    name
  }) {

    assert(!!domainId, "Domain ID is not specified");

    this.domainId = domainId;
    this.name = name || null;
  }

}


export default DomainDto;
