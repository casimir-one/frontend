import { HttpService } from '@deip/http-service';
import { Singleton } from '@deip/toolbox';
import qs from 'qs';

class ProposalsHttp extends Singleton {
  http = HttpService.getInstance();

  createProposal({ tx }) {
    return this.http.post('/api/proposals', { tx });
  }

  updateProposal(req) {
    return this.http.put('/api/v2/proposals/update', req.getHttpBody());
  }

  declineProposal(req) {
    return this.http.put('/api/v2/proposals/decline', req.getHttpBody());
  }

  updateProposalLegacy({ tx }) {
    return this.http.put('/api/proposals', { tx });
  }

  deleteProposalLegacy({ tx }) {
    return this.http.put('/api/proposals/delete', { tx });
  }

  getUserProfile(username) {
    return this.http.get(`/api/v2/users/profile${qs({ accounts: [username] }, { addQueryPrefix: true })}`);
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
