import { HttpService, serializeParams } from '@deip/http-service';
import { createInstanceGetter } from '@deip/toolbox';

export class AssetsHttp {
  http = HttpService.getInstance();

  async create(req) {
    return this.http.post('/api/v2/asset/create', req.getHttpBody());
  }

  async issue(req) {
    return this.http.post('/api/v2/asset/issue', req.getHttpBody());
  }

  async transfer(req) {
    return this.http.post('/api/v2/assets/transfer', req.getHttpBody());
  }

  async createExchangeProposal(req) {
    return this.http.post('/api/v2/assets/exchange', req.getHttpBody());
  }

  async getAccountDepositHistory(account, status) {
    const query = serializeParams({ status });
    return this.http.get(`/api/v2/assets/deposit/history/account/${account}?${query}`);
  }

  async getOne(assetId) {
    return this.http.get(`/api/v2/assets/id/${assetId}`);
  }

  async getOneBySymbol(symbol) {
    return this.http.get(`/api/v2/assets/symbol/${symbol}`);
  }

  async getListByType(type) {
    return this.http.get(`/api/v2/assets/type/${type}`);
  }

  async getListByIssuer(issuer) {
    return this.http.get(`/api/v2/assets/issuer/${issuer}`);
  }

  async lookupAssets(lowerBoundSymbol = '', limit) {
    return this.http.get(`/api/v2/assets/limit/${limit}/${lowerBoundSymbol}`);
  }

  async getAccountAssetBalance(owner, symbol) {
    return this.http.get(`/api/v2/assets/owner/${owner}/symbol/${symbol}`);
  }

  async getAccountAssetsBalancesByOwner(owner) {
    return this.http.get(`/api/v2/assets/owner/${owner}`);
  }

  async getAccountsAssetBalancesByAsset(symbol) {
    return this.http.get(`/api/v2/assets/accounts/symbol/${symbol}`);
  }

  async deposit(payload) {
    return this.http.post('/webhook/assets/deposit', payload);
  }

  /** @type {() => AssetsHttp} */
  static getInstance = createInstanceGetter(AssetsHttp);
}
