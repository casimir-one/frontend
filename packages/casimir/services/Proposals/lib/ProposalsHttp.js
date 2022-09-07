import { HttpService } from '@casimir.one/http-service';
import { makeSingletonInstance } from '@casimir.one/toolbox';

/**
 *  Proposals HTTP transport
 */
export class ProposalsHttp {
  http = HttpService.getInstance();

  /**
   * Accept proposal
   * @param {Object} req
   * @returns {Promise<Object>}
   */
  async accept(req) {
    return this.http.put('/api/v2/proposals/update', req.getHttpBody());
  }

  /**
   * Decline proposal
   * @param {Object} req
   * @returns {Promise<Object>}
   */
  async decline(req) {
    return this.http.put('/api/v2/proposals/decline', req.getHttpBody());
  }

  /**
   * Get proposals by account and status
   * @param {string} account
   * @param {number} status
   * @returns {Promise<Object>}
   */
  async getListByAccount(account, status) {
    return this.http.get(`/api/v2/proposals/${account}/${status}`);
  }

  /**
   * Get proposal
   * @param {string} id
   * @returns {Promise<Object>}
   */
  async getOne(id) {
    return this.http.get(`/api/v2/proposals/${id}`);
  }

  /** @type {() => ProposalsHttp} */
  static getInstance = makeSingletonInstance(() => new ProposalsHttp());
}
