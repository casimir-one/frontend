import DomainDto from './../../../../../base/rpc/response/dto/DomainDto';
import { fromHexFormat } from './../../../utils';


class SubstrateDomainDto extends DomainDto {

  constructor(domain) {
    const domainId = fromHexFormat(domain.externalId);

    super({ 
      domainId
    });
  }

}


export default SubstrateDomainDto;