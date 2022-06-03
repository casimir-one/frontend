import { HttpService } from '@deip/http-service';
import { makeSingletonInstance } from '@deip/toolbox';

/**
 * Attributes HTTP transport
 */
export class InvestmentOpportunityHttp {
  http = HttpService.getInstance();

  /**
   * Get investment opportunity
   * @param {string} id
   * @returns {Promise<Object>}
   */
  async getOne(id) {
    return this.http.get(`/api/v2/investments/investment-opportunity/${id}`);
  }

  /**
   * Get investment opportunities by project ids
   * @param {string} projectId
   * @returns {Promise<Object>}
   */
  async getListByProject(projectId) {
    return this.http.get(`/api/v2/investments/project/${projectId}`);
  }

  /**
   * Get investments by project
   * @param {string} projectId
   * @returns {Promise<Object>}
   */
  async getInvestmentsByProject(projectId) {
    return this.http.get(`/api/v2/investments/project/${projectId}/contributions`);
  }

  /**
   * Create investment opportunity
   * @param {Object} req
   * @returns {Promise<Object>}
   */
  async create(req) {
    return this.http.post('/api/v2/investments', req.getHttpBody());
  }

  /**
   * Invest to investment opportunity
   * @param {Object} req
   * @returns {Promise<Object>}
   */
  async invest(req) {
    return this.http.post('/api/v2/investments/contributions', req.getHttpBody());
  }

  /**
   * Get account revenue history by asset
   * @param {string} account
   * @param {string} symbol asset symbol
   * @param {number} step
   * @param {number} cursor
   * @param {string} targetAsset
   * @returns {Promise<Object>}
   */
  async getAccountRevenueHistoryByAsset(account, symbol, cursor, step, targetAsset) {
    const url = [
      'api',
      'v2',
      'investments',
      'history',
      'account',
      account,
      symbol,
      step,
      cursor,
      'asset',
      targetAsset
    ].join('/');
    return this.http.get(`/${url}`);
  }

  /**
   * Get account revenue history
   * @param {string} account
   * @param {number} cursor
   * @returns {Promise<Object>}
   */
  async getAccountRevenueHistory(account, cursor) {
    return this.http.get(`/api/v2/investments/history/account/${account}/${cursor}`);
  }

  /**
   * Get investment opportunity history for account
   * @param {string} account
   * @returns {Promise<Object>}
   */
  async getAccountInvestmentOpportunityHistory(account) {
    return this.http.get(`/api/v2/investments/history/contributions/account/${account}`);
  }

  /**
   * Get investment opportunity history
   * @param {string} id
   * @returns {Promise<Object>}
   */
  async getInvestmentOpportunityHistoryById(id) {
    return this.http.get(`/api/v2/investments/history/contributions/investment-opportunity/${id}`);
  }

  /**
   * Get asset revenue history
   * @param {string} symbol
   * @param {number} cursor
   * @returns {Promise<Object>}
   */
  async getAssetRevenueHistory(symbol, cursor) {
    return this.http.get(`/api/v2/investments/history/symbol/${symbol}/${cursor}`);
  }

  /** @type {() => InvestmentOpportunityHttp} */
  static getInstance = makeSingletonInstance(() => new InvestmentOpportunityHttp());
}
