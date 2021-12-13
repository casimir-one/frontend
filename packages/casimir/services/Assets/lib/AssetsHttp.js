import { HttpService, serializeParams } from '@deip/http-service';
import { createInstanceGetter } from '@deip/toolbox';

export class AssetsHttp {
  http = HttpService.getInstance();

  async createAsset(req) {
    return this.http.post('/api/v2/asset/create', req.getHttpBody());
  }

  async issueAsset(req) {
    return this.http.post('/api/v2/asset/issue', req.getHttpBody());
  }

  async transferAssets(req) {
    return this.http.post('/api/v2/assets/transfer', req.getHttpBody());
  }

  async createAssetsExchangeProposal(req) {
    return this.http.post('/api/v2/assets/exchange', req.getHttpBody());
  }

  async getAccountDepositHistory(account, status) {
    const query = serializeParams({ status });
    return this.http.get(`/api/v2/assets/deposit/history/account/${account}?${query}`);
  }

  async getAssetById(assetId) {
    return this.http.get(`/api/v2/assets/id/${assetId}`);
  }

  async getAssetBySymbol(symbol) {
    return this.http.get(`/api/v2/assets/symbol/${symbol}`);
  }

  async getAssetsByType(type) {
    return this.http.get(`/api/v2/assets/type/${type}`);
  }

  async getAssetsByIssuer(issuer) {
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

  async depositAssets(payload) {
    return this.http.post('/webhook/assets/deposit', payload);
  }

  /** @type {() => AssetsHttp} */
  static getInstance = createInstanceGetter(AssetsHttp);
}
