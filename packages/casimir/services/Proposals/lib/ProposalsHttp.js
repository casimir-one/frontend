import { HttpService } from '@deip/http-service';
import { createInstanceGetter } from '@deip/toolbox';

export class ProposalsHttp {
  http = HttpService.getInstance();

  async acceptProposal(req) {
    return this.http.put('/api/v2/proposals/update', req.getHttpBody());
  }

  async declineProposal(req) {
    return this.http.put('/api/v2/proposals/decline', req.getHttpBody());
  }

  async getAccountProposals(account, status) {
    return this.http.get(`/api/v2/proposals/${account}/${status}`);
  }

  async getProposal(externalId) {
    return this.http.get(`/api/v2/proposals/${externalId}`);
  }

  /** @type {() => ProposalsHttp} */
  static getInstance = createInstanceGetter(ProposalsHttp);
}
