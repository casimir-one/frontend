import { HttpService } from '@deip/http-service';
import { createInstanceGetter } from '@deip/toolbox';

export class InvestmentOpportunityHttp {
  http = HttpService.getInstance();

  async getOne(id) {
    return this.http.get(`/api/v2/investments/investment-opportunity/${id}`);
  }

  async getListByProject(projectId) {
    return this.http.get(`/api/v2/investments/project/${projectId}`);
  }

  async getInvestmentsByProject(projectId) {
    return this.http.get(`/api/v2/investments/project/${projectId}/contributions`);
  }

  async create(req) {
    return this.http.post('/api/v2/investments', req.getHttpBody());
  }

  async invest(req) {
    return this.http.post('/api/v2/investments/contributions', req.getHttpBody());
  }

  async getAccountRevenueHistoryByAsset(account, symbol, cursor, step, targetAsset) {
    return this.http.get(`/api/v2/investments/history/account/${account}/${symbol}/${step}/${cursor}/asset/${targetAsset}`);
  }

  async getAccountRevenueHistory(account, cursor) {
    return this.http.get(`/api/v2/investments/history/account/${account}/${cursor}`);
  }

  async getAccountInvestmentOpportunityHistory(account) {
    return this.http.get(`/api/v2/investments/history/contributions/account/${account}`);
  }

  async getInvestmentOpportunityHistoryById(id) {
    return this.http.get(`/api/v2/investments/history/contributions/investment-opportunity/${id}`);
  }

  async getAssetRevenueHistory(symbol, cursor) {
    return this.http.get(`/api/v2/investments/history/symbol/${symbol}/${cursor}`);
  }

  /** @type {() => InvestmentOpportunityHttp} */
  static getInstance = createInstanceGetter(InvestmentOpportunityHttp);
}
