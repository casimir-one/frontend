import { HttpService } from '@deip/http-service';
import { Singleton } from '@deip/toolbox';

class ProposalsHttp extends Singleton {
  http = HttpService.getInstance();

  updateProposal(req) {
    return this.http.put('/api/v2/proposals/update', req.getHttpBody());
  }

  declineProposal(req) {
    return this.http.put('/api/v2/proposals/decline', req.getHttpBody());
  }

  getAccountProposals(account, status) {
    return this.http.get(`/api/v2/proposals/${account}/${status}`);
  }

  getProposal(externalId) {
    return this.http.get(`/api/v2/proposals/${externalId}`);
  }
}

export {
  ProposalsHttp
};
