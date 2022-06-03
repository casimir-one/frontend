import { HttpService, serializeParams } from '@deip/http-service';
import { makeSingletonInstance } from '@deip/toolbox';

export class ContractAgreementHttp {
  http = HttpService.getInstance();

  /**
   * Create contract agreement
   * @param {Object} req
   * @returns {Promise<Object>}
   */
  async create(req) {
    return this.http.post('/api/v2/contract-agreement', req.getHttpBody());
  }

  /**
   * Accept contract agreement
   * @param {Object} req
   * @returns {Promise<Object>}
   */
  async accept(req) {
    return this.http.post('/api/v2/contract-agreement/accept', req.getHttpBody());
  }

  /**
   * Reject contract agreement
   * @param {Object} req
   * @returns {Promise<Object>}
   */
  async reject(req) {
    return this.http.post('/api/v2/contract-agreement/reject', req.getHttpBody());
  }

  /**
   * Propose contract agreement
   * @param {Object} req
   * @returns {Promise<Object>}
   */
  async propose(req) {
    return this.http.post('/api/v2/contract-agreement', req.getHttpBody());
  }

  /**
   * Get contract agreement list by several parameters
   * @param {Object} params
   * @returns {Promise<Object>}
   */
  async getList(params) {
    const query = serializeParams({ ...params });
    return this.http.get(`/api/v2/contract-agreements?${query}`);
  }

  /**
   * Get contract agreement by id
   * @param {string} id
   * @returns {Promise<Object>}
   */
  async getOne(id) {
    return this.http.get(`/api/v2/contract-agreement/${id}`);
  }

  /** @type {() => ContractAgreementHttp} */
  static getInstance = makeSingletonInstance(() => new ContractAgreementHttp());
}
