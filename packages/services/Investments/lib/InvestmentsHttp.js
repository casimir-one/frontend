import { HttpService } from '@deip/http-service';
import { Singleton } from '@deip/toolbox';

class InvestmentsHttp extends Singleton {
  http = HttpService.getInstance();

  createResearchTokenSale({ tx, isProposal, offchainMeta }) {
    return this.http.post('/api/research/token-sale', { tx, isProposal, offchainMeta });
  }

  contributeResearchTokenSale({ tx, isProposal }) {
    return this.http.post('/api/research/token-sale/contribution', { tx, isProposal });
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
