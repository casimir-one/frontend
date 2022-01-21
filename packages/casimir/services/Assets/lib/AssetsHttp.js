import { HttpService, serializeParams } from '@deip/http-service';
import { createInstanceGetter } from '@deip/toolbox';

 /**
 * Assets http transport
 */
export class AssetsHttp {
  http = HttpService.getInstance();

  /**
   * Create new fungible token
   * @param {Object} req
   * @return {Promise<Object>}
   */
  async createFungibleToken(req) {
    return this.http.post('/api/v2/asset/ft/create', req.getHttpBody());
  }

  /**
   * Create new non-fungible token class
   * @param {Object} req
   * @return {Promise<Object>}
   */
  async createNonFungibleToken(req) {
    return this.http.post('/api/v2/asset/nft/create', req.getHttpBody());
  }

  /**
   * Issue created fungible token
   * @param {Object} req
   * @return {Promise<Object>}
   */
  async issueFungibleToken(req) {
    return this.http.post('/api/v2/asset/ft/issue', req.getHttpBody());
  }

  /**
   * Issue an instance of non-fungible token class
   * @param {Object} req
   * @return {Promise<Object>}
   */
  async issueNonFungibleToken(req) {
    return this.http.post('/api/v2/asset/nft/issue', req.getHttpBody());
  }

  /**
   * Transfer asset to other owner
   * @param {Object} req
   * @return {Promise<Object>}
   */
  async transfer(req) {
    return this.http.post('/api/v2/assets/transfer', req.getHttpBody());
  }

  /**
   * Create proposal for asset exchange
   * @param {Object} req
   * @return {Promise<Object>}
   */
  async createExchangeProposal(req) {
    return this.http.post('/api/v2/assets/exchange', req.getHttpBody());
  }

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
   * Get certain asset information
   * @param {string} assetId
   * @return {Promise<Object>}
   */
  async getOne(assetId) {
    return this.http.get(`/api/v2/assets/id/${assetId}`);
  }

  /**
   * Get asset information by asset symbol
   * @param {string} symbol
   * @return {Promise<Object>}
   */
  async getOneBySymbol(symbol) {
    return this.http.get(`/api/v2/assets/symbol/${symbol}`);
  }

  /**
   * Get assets by asset type
   * @param {number} type
   * @return {Promise<Object>}
   */
  async getListByType(type) {
    return this.http.get(`/api/v2/assets/type/${type}`);
  }

  /**
   * Get assets by tokens issuer
   * @param {string} issuer
   * @return {Promise<Object>}
   */
  async getListByIssuer(issuer) {
    return this.http.get(`/api/v2/assets/issuer/${issuer}`);
  }

  /**
   * Get list of assets
   * @param {number} limit
   * @param {string} lowerBoundSymbol
   * @return {Promise<Object>}
   */
  async lookupAssets(limit, lowerBoundSymbol = '') {
    return this.http.get(`/api/v2/assets/limit/${limit}/${lowerBoundSymbol}`);
  }

  /**
   * Get asset balances by symbol for certain account
   * @param {string} owner
   * @param {string} symbol
   * @return {Promise<Object>}
   */
  async getAccountAssetBalance(owner, symbol) {
    return this.http.get(`/api/v2/assets/owner/${owner}/symbol/${symbol}`);
  }

  /**
   * Get asset balances by owner
   * @param {string} owner
   * @return {Promise<Object>}
   */
  async getAccountAssetsBalancesByOwner(owner) {
    return this.http.get(`/api/v2/assets/owner/${owner}`);
  }

  /**
   * Get certain assets balances for all accounts
   * @param {string} symbol
   * @return {Promise<Object>}
   */
  async getAccountsAssetBalancesByAsset(symbol) {
    return this.http.get(`/api/v2/assets/accounts/symbol/${symbol}`);
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
  static getInstance = createInstanceGetter(AssetsHttp);
}
