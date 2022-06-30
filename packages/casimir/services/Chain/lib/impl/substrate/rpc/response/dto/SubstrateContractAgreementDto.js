import ContractAgreementDto from './../../../../../base/rpc/response/dto/ContractAgreementDto';
import { fromHexFormat } from './../../../utils';
import { CONTRACT_AGREEMENT_STATUS } from '@casimir/platform-core';


class SubstrateContractAgreementDto extends ContractAgreementDto {

  constructor(agreementWrap) {
    
    if (agreementWrap['license']) {
      const licenseByStatus = agreementWrap['license'];
      const licenseStatuses = [{
        key: 'unsigned',
        value: CONTRACT_AGREEMENT_STATUS.PENDING
      },
      {
        key: 'signedByLicenser',
        value: CONTRACT_AGREEMENT_STATUS.PENDING
      },
      {
        key: 'signed',
        value: CONTRACT_AGREEMENT_STATUS.APPROVED
      },
      {
        key: 'rejected',
        value: CONTRACT_AGREEMENT_STATUS.REJECTED
      }];

      const license = licenseStatuses.reduce((license, status) => {
        if (!license && licenseByStatus[status.key]) {
          license = { ...licenseByStatus[status.key], status: status.value };
        }
        return license;
      }, null);

      const agreementId = fromHexFormat(license.id);
      const creator = license.creator; // address
      const expirationTime = license.expirationTime;
      const activationTime = license.activationTime;
      const hash = fromHexFormat(license.hash);
      const parties = [license.licensee, license.licenser];
      const status = license.status;

      super({ agreementId, creator, parties, hash, activationTime, expirationTime, status });

    } else {
      const agreementByStatus = agreementWrap['generalContract'];
      const agreementStatuses = [{
        key: 'partiallyAccepted',
        value: CONTRACT_AGREEMENT_STATUS.PENDING
      },
      {
        key: 'accepted',
        value: CONTRACT_AGREEMENT_STATUS.APPROVED
      },
      {
        key: 'rejected',
        value: CONTRACT_AGREEMENT_STATUS.REJECTED
      }];
      
      const agreement = agreementStatuses.reduce((agreement, status) => {
        if (!agreement && agreementByStatus[status.key]) {
          const contract = agreementByStatus[status.key].contract
            ? agreementByStatus[status.key].contract
            : agreementByStatus[status.key];
          agreement = { ...contract, status: status.value };
        }
        return agreement;
      }, null);

      const agreementId = fromHexFormat(agreement.id);
      const creator = agreement.creator; // address
      const expirationTime = agreement.expirationTime;
      const activationTime = agreement.activationTime;
      const hash = fromHexFormat(agreement.hash);
      const parties = agreement.parties;
      const status = agreement.status;

      super({ 
        agreementId, 
        creator, 
        parties, 
        hash, 
        activationTime, 
        expirationTime, 
        status 
      });

    }
    
  }

}


export default SubstrateContractAgreementDto;