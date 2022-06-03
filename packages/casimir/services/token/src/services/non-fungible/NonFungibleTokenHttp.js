import { HttpService, serializeParams } from '@deip/http-service';
import { makeSingletonInstance } from '@deip/toolbox';

/**
 * Non-fungible token http transport
 */
export class NonFungibleTokenHttp {
  http = HttpService.getInstance();

  /**
   * Create new non-fungible token class
   * @param {Object} req
   * @return {Promise<Object>}
   */
  async create(req) {
    return this.http.post('/api/v2/tokens/nft/create', req.getHttpBody());
  }

  /**
   * Issue an instance of non-fungible token class
   * @param {Object} req
   * @return {Promise<Object>}
   */
  async issue(req) {
    return this.http.post('/api/v2/tokens/nft/issue', req.getHttpBody());
  }

  /**
   * Transfer non-fungible token to other owner
   * @param {Object} req
   * @return {Promise<Object>}
   */
  async transfer(req) {
    return this.http.post('/api/v2/tokens/nft/transfer', req.getHttpBody());
  }

  /**
   * Get non-fungible token
   * @param {string} classId
   * @return {Promise<Object>}
   */
  async getClass(classId) {
    return this.http.get(`/api/v2/tokens/nfts/class/${classId}`);
  }

  /**
   * Get all non-fungible tokens
   * @param {Object} query
   * @return {Promise<Object>}
   */
  async getClasses(query) {
    const serializedQuery = serializeParams(query);
    return this.http.get(`/api/v2/tokens/nfts/classes?${serializedQuery}`);
  }

  /**
   * Get non-fungible token instances by non-fungible token and owner
   * @param {string} account
   * @param {string} classId
   * @return {Promise<Object>}
   */
  async getClassInstancesByOwner(account, classId) {
    return this.http.get(`/api/v2/tokens/nfts/instances/owner/${account}/class/${classId}`);
  }

  /**
   * Get non-fungible token instances by owner
   * @param {string} account
   * @return {Promise<Object>}
   */
  async getClassesInstancesByOwner(account) {
    return this.http.get(`/api/v2/tokens/nfts/instances/owner/${account}`);
  }

  /** @type {() => NonFungibleTokenHttp} */
  static getInstance = makeSingletonInstance(() => new NonFungibleTokenHttp());
}
