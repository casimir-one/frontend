import { assert } from '@casimir/toolbox';
import { isValidTimestampFormat } from './../utils';


class ContractAgreementDto {

  constructor({
    agreementId,
    creator,
    parties,
    hash,
    status,
    activationTime,
    expirationTime
  }) {

    assert(!!agreementId, "Contract agreement 'ID' is not specified");
    assert(!!creator, "Contract agreement 'creator' is not specified");
    assert(!!parties && parties.length > 1, "Contract agreement 'parties' are not specified");
    assert(!!hash, "Contract agreement 'hash' is not specified");
    // assert(!!status, "Contract agreement 'status' is not specified"); // TODO: add in Graphene
    assert(!activationTime || isValidTimestampFormat(activationTime), `Contract agreement 'activationTime' format is invalid ${activationTime}`);
    assert(!expirationTime || isValidTimestampFormat(expirationTime), `Contract agreement 'expirationTime' format is invalid ${expirationTime}`);

    this.agreementId = agreementId;
    this.creator = creator;
    this.parties = parties;
    this.hash = hash;
    this.status = status || undefined;
    this.activationTime = activationTime || null;
    this.expirationTime = expirationTime || null;

  }

}


export default ContractAgreementDto;
