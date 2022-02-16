import { HttpService, serializeParams } from '@deip/http-service';
import { createInstanceGetter } from '@deip/toolbox';

export class ContractAgreementHttp {
  http = HttpService.getInstance();

  async create(req) {
    return this.http.post('/api/v2/contract-agreement', req.getHttpBody());
  }

  async accept(req) {
    return this.http.post('/api/v2/contract-agreement/accept', req.getHttpBody());
  }

  async reject(req) {
    return this.http.post('/api/v2/contract-agreement/reject', req.getHttpBody());
  }

  async propose(req) {
    return this.http.post('/api/v2/contract-agreement', req.getHttpBody());
  }

  async getList(params) {
    const query = serializeParams({ ...params });
    return this.http.get(`/api/v2/contract-agreements?${query}`);
  }

  async getOne(id) {
    return this.http.get(`/api/v2/contract-agreement/${id}`);
  }

  /** @type {() => ContractAgreementHttp} */
  static getInstance = createInstanceGetter(ContractAgreementHttp);
}
