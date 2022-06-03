import { HttpService, serializeParams } from '@deip/http-service';
import { makeSingletonInstance } from '@deip/toolbox';

/**
 * Assets http transport
 */
export class AssetsHttp {
  http = HttpService.getInstance();

  /**
   * Deposit history for certain account
   * @param {string} account
   * @param {string} status
   * @return {Promise<Object>}
   */
  async getAccountDepositHistory(account, status) {
    const query = serializeParams({ status });
    return this.http.get(`/api/v2/assets/deposit/history/account/${account}?${query}`);
  }

  /**
   * Get assets by asset type
   * @param {string} type
   * @return {Promise<Object>}
  */
  async getAssetsByType(type) {
    return this.http.get(`/api/v2/assets/type/${type}`);
  }

  /**
   * Get assets by Issuer
   * @param {string} issuer
   * @return {Promise<Object>}
  */
  async getAssetsByIssuer(issuer) {
    return this.http.get(`/api/v2/assets/issuer/${issuer}`);
  }

  /**
   * Get all assets
   * @param {number} limit
   * @return {Promise<Object>}
  */
  async lookupAssets(limit) {
    return this.http.get(`/api/v2/assets/limit/${limit}`);
  }

  /**
   * Deposit asset
   * @param {Object} payload
   * @return {Promise<Object>}
   */
  async deposit(payload) {
    return this.http.post('/webhook/assets/deposit', payload);
  }

  /** @type {() => AssetsHttp} */
  static getInstance = makeSingletonInstance(() => new AssetsHttp());
}
