import { HttpService } from '@deip/http-service';
import { createInstanceGetter } from '@deip/toolbox';

export class ProposalsHttp {
  http = HttpService.getInstance();

  async accept(req) {
    return this.http.put('/api/v2/proposals/update', req.getHttpBody());
  }

  async decline(req) {
    return this.http.put('/api/v2/proposals/decline', req.getHttpBody());
  }

  async getListByAccount(account, status) {
    return this.http.get(`/api/v2/proposals/${account}/${status}`);
  }

  async getOne(id) {
    return this.http.get(`/api/v2/proposals/${id}`);
  }

  /** @type {() => ProposalsHttp} */
  static getInstance = createInstanceGetter(ProposalsHttp);
}
