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
    return this.http.post('/api/v2/tokens/ft/create', req.getHttpBody());
  }

  /**
   * Create new non-fungible token class
   * @param {Object} req
   * @return {Promise<Object>}
   */
  async createNonFungibleToken(req) {
    return this.http.post('/api/v2/tokens/nft/create', req.getHttpBody());
  }

  /**
   * Issue created fungible token
   * @param {Object} req
   * @return {Promise<Object>}
   */
  async issueFungibleToken(req) {
    return this.http.post('/api/v2/tokens/ft/issue', req.getHttpBody());
  }

  /**
   * Issue an instance of non-fungible token class
   * @param {Object} req
   * @return {Promise<Object>}
   */
  async issueNonFungibleToken(req) {
    return this.http.post('/api/v2/tokens/nft/issue', req.getHttpBody());
  }

  /**
   * Transfer fungible token to other owner
   * @param {Object} req
   * @return {Promise<Object>}
   */
  async transferFungibleToken(req) {
    return this.http.post('/api/v2/tokens/ft/transfer', req.getHttpBody());
  }

  /**
   * Transfer non-fungible token to other owner
   * @param {Object} req
   * @return {Promise<Object>}
   */
  async transferNonFungibleToken(req) {
    return this.http.post('/api/v2/tokens/nft/transfer', req.getHttpBody());
  }

  /**
   * Create proposal for swap tokens
   * @param {Object} req
   * @return {Promise<Object>}
   */
  async createTokensSwapProposal(req) {
    return this.http.post('/api/v2/tokens/swap', req.getHttpBody());
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
   * Get assets by asset type
   * @param {Object} req
   * @return {Promise<Object>}
  */
  async getAssetsByType(type) {
    return this.http.get(`/api/v2/assets/type/${type}`);
  }

  /**
   * Get assets by Issuer
   * @param {Object} req
   * @return {Promise<Object>}
  */
  async getAssetsByIssuer(issuer) {
    return this.http.get(`/api/v2/assets/issuer/${issuer}`);
  }

  /**
   * Get all assets
   * @param {Object} req
   * @return {Promise<Object>}
  */
  async lookupAssets(limit) {
    return this.http.get(`/api/v2/assets/limit/${limit}`);
  }

  /**
   * Get certain fungible token information
   * @param {string} tokenId
   * @return {Promise<Object>}
   */
  async getFungibleToken(tokenId) {
    return this.http.get(`/api/v2/tokens/ft/id/${tokenId}`);
  }

  /**
   * Get fungible token information by fungible token symbol
   * @param {string} symbol
   * @return {Promise<Object>}
   */
  async getFungibleTokenBySymbol(symbol) {
    return this.http.get(`/api/v2/tokens/ft/symbol/${symbol}`);
  }

  /**
   * Get fungible tokens by fungible token type
   * @param {number} type
   * @return {Promise<Object>}
   */
  async getFungibleTokensListByType(type) {
    return this.http.get(`/api/v2/tokens/ft/type/${type}`);
  }

  /**
   * Get non-fungible token by account
   * @param {Object} req
   * @return {Promise<Object>}
  */
  async getNonFungibleTokenByAccount(account) {
    return this.http.get(`/api/v2/tokens/nfts/account/${account}`);
  }

  /**
   * Get fungible tokens by tokens issuer
   * @param {string} issuer
   * @return {Promise<Object>}
   */
  async getFungibleTokensListByIssuer(issuer) {
    return this.http.get(`/api/v2/tokens/ft/issuer/${issuer}`);
  }

  /**
   * Get list of fungible tokens
   * @param {number} limit
   * @param {string} lowerBoundSymbol
   * @return {Promise<Object>}
   */
  async lookupFungibleTokens(limit, lowerBoundSymbol = '') {
    return this.http.get(`/api/v2/tokens/ft/limit/${limit}/${lowerBoundSymbol}`);
  }

  /**
   * Get fungible token balances by symbol for certain account
   * @param {string} owner
   * @param {string} symbol
   * @return {Promise<Object>}
   */
  async getAccountFungibleTokenBalance(owner, symbol) {
    return this.http.get(`/api/v2/tokens/ft/owner/${owner}/symbol/${symbol}`);
  }

  /**
   * Get fungible token balances by owner
   * @param {string} owner
   * @return {Promise<Object>}
   */
  async getAccountFungibleTokensBalancesByOwner(owner) {
    return this.http.get(`/api/v2/tokens/ft/owner/${owner}`);
  }

  /**
   * Get certain fungible tokens balances for all accounts
   * @param {string} symbol
   * @return {Promise<Object>}
   */
  async getAccountsFungibleTokenBalancesByFungibleToken(symbol) {
    return this.http.get(`/api/v2/tokens/ft/accounts/symbol/${symbol}`);
  }

  /**
   * Get non-fungible token
   * @param {Object} req
   * @return {Promise<Object>}
  */
  async getNonFungibleTokenClass(classId) {
    return this.http.get(`/api/v2/tokens/nfts/class/${classId}`);
  }

  /**
   * Get all non-fungible tokens
   * @param {Object} req
   * @return {Promise<Object>}
  */
  async getNonFungibleTokenClasses() {
    return this.http.get('/api/v2/tokens/nfts/classes');
  }

  /**
   * Get non-fungible token instances by non-fungible token and owner
   * @param {Object} req
   * @return {Promise<Object>}
  */
  async getNonFungibleTokenClassInstancesByOwner(account, classId) {
    return this.http.get(`/api/v2/tokens/nfts/instances/owner/${account}/class/${classId}`);
  }

  /**
   * Get non-fungible token instances by owner
   * @param {Object} req
   * @return {Promise<Object>}
  */
  async getNonFungibleTokenClassesInstancesByOwner(account) {
    return this.http.get(`/api/v2/tokens/nfts/instances/owner/${account}`);
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
