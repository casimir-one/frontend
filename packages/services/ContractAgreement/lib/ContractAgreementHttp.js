import { HttpService } from '@deip/http-service';
import { Singleton } from '@deip/toolbox';
import qs from 'qs';

class ContractAgreementHttp extends Singleton {
  http = HttpService.getInstance();

  createContractAgreement(req) {
    return this.http.post('/api/v2/contract-agreement', req.getHttpBody());
  }

  acceptContractAgreement(req) {
    return this.http.post('/api/v2/contract-agreement/accept', req.getHttpBody());
  }

  proposeContractAgreement(req) {
    return this.http.post('/api/v2/contract-agreement', req.getHttpBody());
  }

  getContractAgreements(query) {
    const q = qs.stringify({ ...query });
    return this.http.get(`/api/v2/contract-agreements?${q}`);
  }

  getContractAgreement(contractAgreementId) {
    return this.http.get(`/api/v2/contract-agreement/${contractAgreementId}`);
  }
}

export {
  ContractAgreementHttp
};
