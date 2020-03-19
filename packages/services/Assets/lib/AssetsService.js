import deipRpc from '@deip/rpc-client';
import { Singleton } from '@deip/toolbox';
import { AccessService } from '@deip/access-service';
import { AppConfigService } from '@deip/app-config-service';

class AssetsService extends Singleton {

  accessService = AccessService.getInstance();

  createAsset({ issuer, symbol, precision, name, description }) {
    return deipRpc.broadcast.createAssetAsync(
      this.accessService.getOwnerWif(),
      issuer,
      symbol,
      precision,
      name,
      description);
  }

  issueAsset({ issuer, amount }) {
    return deipRpc.broadcast.issueAssetAsync(
      this.accessService.getOwnerWif(),
      issuer,
      amount);
  }

  reserveAsset({ owner, amount }) {
    return deipRpc.broadcast.reserveAssetAsync(
      this.accessService.getOwnerWif(),
      owner,
      amount);
  }

  getAssetById(id) {
    return deipRpc.api.getAssetAsync(id);
  }

  getAssetBySymbol(symbol) {
    return deipRpc.api.getAssetByStringSymbolAsync(symbol);
  }

  getAccountBalanceById(id) {
    return deipRpc.api.getAccountBalanceAsync(id);
  }

  getAccountBalancesByOwner(owner) {
    return deipRpc.api.getAccountBalancesByOwnerAsync(owner);
  }

  getAccountBalanceByOwnerAndAsset(owner, symbol) {
    return deipRpc.api.getAccountBalanceByOwnerAndAssetSymbolAsync(owner, symbol);
  }

}

export {
  AssetsService
};
