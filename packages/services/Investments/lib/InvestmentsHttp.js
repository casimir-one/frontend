import { HttpService } from '@deip/http-service';
import { Singleton } from '@deip/toolbox';

class InvestmentsHttp extends Singleton {
  http = HttpService.getInstance();

  getResearchTokenSalesByResearch(researchExternalId) {
    return this.http.get(`/api/fundraising/research/${researchExternalId}`);
  }

  getResearchTokenSaleContributions(researchTokenSaleExternalId) {
    return this.http.get(`/api/fundraising/${researchTokenSaleExternalId}/contributions`);
  }

  getResearchTokenSaleContributionsByResearch(researchExternalId) {
    return this.http.get(`/api/fundraising/research/${researchExternalId}/contributions`);
  }

  createResearchTokenSale({ tx, isProposal, offchainMeta }) {
    return this.http.post('/api/fundraising', { tx, isProposal, offchainMeta });
  }

  contributeResearchTokenSale({ tx, isProposal }) {
    return this.http.post('/api/fundraising/contributions', { tx, isProposal });
  }

  getInvestmentPortfolio(username) {
    return this.http.get(`/api/investment-portfolio/${username}`);
  }

  updateInvestmentPortfolio(username, updated) {
    return this.http.put(`/api/investment-portfolio/${username}`, updated);
  }
}

export {
  InvestmentsHttp
};
