import { HttpService, serializeParams } from '@deip/http-service';
import { createInstanceGetter } from '@deip/toolbox';

export class ContractAgreementHttp {
  http = HttpService.getInstance();

  async createContractAgreement(req) {
    return this.http.post('/api/v2/contract-agreement', req.getHttpBody());
  }

  async acceptContractAgreement(req) {
    return this.http.post('/api/v2/contract-agreement/accept', req.getHttpBody());
  }

  async rejectContractAgreement(req) {
    return this.http.post('/api/v2/contract-agreement/reject', req.getHttpBody());
  }

  async proposeContractAgreement(req) {
    return this.http.post('/api/v2/contract-agreement', req.getHttpBody());
  }

  async getContractAgreements(params) {
    const query = serializeParams({ ...params });
    return this.http.get(`/api/v2/contract-agreements?${query}`);
  }

  async getContractAgreement(contractAgreementId) {
    return this.http.get(`/api/v2/contract-agreement/${contractAgreementId}`);
  }

  /** @type {() => ContractAgreementHttp} */
  static getInstance = createInstanceGetter(ContractAgreementHttp);
}
