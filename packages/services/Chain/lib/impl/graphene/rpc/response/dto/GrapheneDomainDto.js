import DomainDto from './../../../../../base/rpc/response/dto/DomainDto';


class GrapheneDomainDto extends DomainDto {

  constructor(domain) {
    const domainId = domain.external_id;
    const name = domain.name;

    super({ 
      domainId,
      name
    });
  }

}


export default GrapheneDomainDto;