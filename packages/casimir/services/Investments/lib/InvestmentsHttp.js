import { HttpService } from '@deip/http-service';
import { createInstanceGetter } from '@deip/toolbox';

export class InvestmentsHttp {
  http = HttpService.getInstance();

  async getProjectTokenSale(investmentOpportunityId) {
    return this.http.get(`/api/v2/investments/investment-opportunity/${investmentOpportunityId}`);
  }

  async getProjectTokenSalesByProject(projectId) {
    return this.http.get(`/api/v2/investments/project/${projectId}`);
  }

  async getProjectTokenSaleInvestmentsByProject(projectId) {
    return this.http.get(`/api/v2/investments/project/${projectId}/contributions`);
  }

  async createProjectTokenSale(req) {
    return this.http.post('/api/v2/investments', req.getHttpBody());
  }

  async investProjectTokenSale(req) {
    return this.http.post('/api/v2/investments/contributions', req.getHttpBody());
  }

  async getAccountRevenueHistoryByAsset(account, symbol, cursor, step, targetAsset) {
    return this.http.get(`/api/v2/investments/history/account/${account}/${symbol}/${step}/${cursor}/asset/${targetAsset}`);
  }

  async getAccountRevenueHistory(account, cursor) {
    return this.http.get(`/api/v2/investments/history/account/${account}/${cursor}`);
  }

  async getAccountInvestmentsHistory(account) {
    return this.http.get(`/api/v2/investments/history/contributions/account/${account}`);
  }

  async getInvestmentsHistoryByTokenSale(tokenSaleId) {
    return this.http.get(`/api/v2/investments/history/contributions/investment-opportunity/${tokenSaleId}`);
  }

  async getAssetRevenueHistory(symbol, cursor) {
    return this.http.get(`/api/v2/investments/history/symbol/${symbol}/${cursor}`);
  }

  /** @type {() => InvestmentsHttp} */
  static getInstance = createInstanceGetter(InvestmentsHttp);
}
