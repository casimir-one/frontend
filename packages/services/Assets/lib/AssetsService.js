import deipRpc from '@deip/deip-oa-rpc-client';
import { Singleton } from '@deip/toolbox';
import { AccessService } from '@deip/access-service';
import { AppConfigService } from '@deip/app-config-service';

class AssetsService extends Singleton {

  accessService = AccessService.getInstance();

  _deipRpcInstance;

  get deipRpc() {
    if (!this._deipRpcInstance) {
      const env = AppConfigService.getInstance().get('env');

      this._deipRpcInstance = deipRpc;

      this._deipRpcInstance.api.setOptions({
        url: env.DEIP_FULL_NODE_URL,
        reconnectTimeout: 3000
      });

      this._deipRpcInstance.config.set('chain_id', env.CHAIN_ID);
    }
    return this._deipRpcInstance;
  }

  createAsset({ issuer, symbol, precision, name, description }) {
    return this.deipRpc.broadcast.createAssetAsync(
      this.accessService.getOwnerWif(),
      issuer,
      symbol,
      precision,
      name,
      description);
  }

  issueAsset({ issuer, amount }) {
    return this.deipRpc.broadcast.issueAssetAsync(
      this.accessService.getOwnerWif(),
      issuer,
      amount);
  }

  reserveAsset({ owner, amount }) {
    return this.deipRpc.broadcast.reserveAssetAsync(
      this.accessService.getOwnerWif(),
      owner,
      amount);
  }

  getAssetById(id) {
    return this.deipRpc.api.getAssetAsync(id);
  }

  getAssetBySymbol(symbol) {
    return this.deipRpc.api.getAssetByStringSymbolAsync(symbol);
  }

  getAccountBalanceById(id) {
    return this.deipRpc.api.getAccountBalanceAsync(id);
  }

  getAccountBalancesByOwner(owner) {
    return this.deipRpc.api.getAccountBalancesByOwnerAsync(owner);
  }

  getAccountBalanceByOwnerAndAsset(owner, symbol) {
    return this.deipRpc.api.getAccountBalanceByOwnerAndAssetSymbolAsync(owner, symbol);
  }
  
}

export {
  AssetsService
};
