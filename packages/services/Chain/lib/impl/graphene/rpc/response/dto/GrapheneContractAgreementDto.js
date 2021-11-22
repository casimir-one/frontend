import ContractAgreementDto from './../../../../../base/rpc/response/dto/ContractAgreementDto';


class GrapheneContractAgreementDto extends ContractAgreementDto {

  constructor(agreement) {
    const agreementId = agreement.external_id;
    const creator = agreement.creator;
    const parties = agreement.parties;
    const hash = agreement.hash;
    const activationTime = agreement.start_time ? new Date(agreement.start_time).getTime() : null;
    const expirationTime = agreement.end_time ? new Date(agreement.end_time).getTime() : null;

    super({ 
      agreementId, 
      creator, 
      parties, 
      hash, 
      activationTime, 
      expirationTime 
    });
  }

}


export default GrapheneContractAgreementDto;