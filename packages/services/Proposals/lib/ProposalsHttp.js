import { HttpService } from '@deip/http-service';
import { Singleton } from '@deip/toolbox';

class ProposalsHttp extends Singleton {
  http = HttpService.getInstance();

  createProposal({ tx }) {
    return this.http.post(`/api/proposals`, { tx });
  }

  updateProposal({ tx }) {
    return this.http.put(`/api/proposals`, { tx });
  }

  deleteProposal({ tx }) {
    return this.http.put(`/api/proposals/delete`, { tx });
  }

  getUserProfile(username) {
    return this.http.get(`/api/user/profiles${this.http.buildQueryString([username], 'accounts')}`);
  }

  getAccountProposals(account, status) {
    return this.http.get(`/api/proposals/${account}/${status}`);
  }

  getProposal(externalId) {
    return this.http.get(`/api/proposals/${externalId}`);
  }
  
}

export {
  ProposalsHttp
};
