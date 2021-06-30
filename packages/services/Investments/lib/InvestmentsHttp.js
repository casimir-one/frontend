import { HttpService } from '@deip/http-service';
import { Singleton } from '@deip/toolbox';

class InvestmentsHttp extends Singleton {
  http = HttpService.getInstance();

  getProjectTokenSale(tokenSaleId) {
    return this.http.get(`/api/v2/fundraising/token-sale/${tokenSaleId}`);
  }

  getProjectTokenSalesByProject(projectId) {
    return this.http.get(`/api/v2/fundraising/project/${projectId}`);
  }

  getProjectTokenSaleContributions(projectTokenSaleExternalId) {
    return this.http.get(`/api/v2/fundraising/${projectTokenSaleExternalId}/contributions`);
  }

  getProjectTokenSaleContributionsByProject(projectId) {
    return this.http.get(`/api/v2/fundraising/project/${projectId}/contributions`);
  }

  createProjectTokenSale(req) {
    return this.http.post('/api/v2/fundraising', req.getHttpBody());
  }

  contributeProjectTokenSale(req) {
    return this.http.post('/api/v2/fundraising/contributions', req.getHttpBody());
  }

  getAccountRevenueHistoryByAsset(account, symbol, cursor, step, targetAsset) {
    return this.http.get(`/api/v2/history/account/${account}/${symbol}/${step}/${cursor}/asset/${targetAsset}`);
  }

  getAccountRevenueHistory(account, cursor) {
    return this.http.get(`/api/v2/history/account/${account}/${cursor}`);
  }

  getAccountContributionsHistory(account) {
    return this.http.get(`/api/v2/history/contributions/account/${account}`);
  }

  getAssetRevenueHistory(symbol, cursor) {
    return this.http.get(`/api/v2/history/symbol/${symbol}/${cursor}`);
  }
}

export {
  InvestmentsHttp
};
