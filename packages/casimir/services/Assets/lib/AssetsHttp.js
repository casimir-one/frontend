import { HttpService } from '@deip/http-service';
import { makeSingletonInstance } from '@deip/toolbox';

/**
 * Assets http transport
 */
export class AssetsHttp {
  http = HttpService.getInstance();

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

  /** @type {() => AssetsHttp} */
  static getInstance = makeSingletonInstance(() => new AssetsHttp());
}
