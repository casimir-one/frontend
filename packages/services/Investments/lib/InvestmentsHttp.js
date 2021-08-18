import { HttpService } from '@deip/http-service';
import { Singleton } from '@deip/toolbox';

class InvestmentsHttp extends Singleton {
  http = HttpService.getInstance();

  getProjectTokenSale(tokenSaleId) {
    return this.http.get(`/api/v2/investments/token-sale/${tokenSaleId}`);
  }

  getProjectTokenSalesByProject(projectId) {
    return this.http.get(`/api/v2/investments/project/${projectId}`);
  }

  getProjectTokenSaleInvestments(projectTokenSaleExternalId) {
    return this.http.get(`/api/v2/investments/${projectTokenSaleExternalId}/contributions`);
  }

  getProjectTokenSaleInvestmentsByProject(projectId) {
    return this.http.get(`/api/v2/investments/project/${projectId}/contributions`);
  }

  createProjectTokenSale(req) {
    return this.http.post('/api/v2/investments', req.getHttpBody());
  }

  investProjectTokenSale(req) {
    return this.http.post('/api/v2/investments/contributions', req.getHttpBody());
  }

  getAccountRevenueHistoryByAsset(account, symbol, cursor, step, targetAsset) {
    return this.http.get(`/api/v2/investments/history/account/${account}/${symbol}/${step}/${cursor}/asset/${targetAsset}`);
  }

  getAccountRevenueHistory(account, cursor) {
    return this.http.get(`/api/v2/investments/history/account/${account}/${cursor}`);
  }

  getAccountInvestmentsHistory(account) {
    return this.http.get(`/api/v2/investments/history/contributions/account/${account}`);
  }

  getInvestmentsHistoryByTokenSale(tokenSaleId) {
    return this.http.get(`/api/v2/investments/history/contributions/token-sale/${tokenSaleId}`);
  }

  getAssetRevenueHistory(symbol, cursor) {
    return this.http.get(`/api/v2/investments/history/symbol/${symbol}/${cursor}`);
  }
}

export {
  InvestmentsHttp
};
