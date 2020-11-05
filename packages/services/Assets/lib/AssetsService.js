import deipRpc from '@deip/rpc-client';
import { Singleton } from '@deip/toolbox';
import { AccessService } from '@deip/access-service';
import { AppConfigService } from '@deip/app-config-service';

class AssetsService extends Singleton {

  accessService = AccessService.getInstance();

  transferAsset({ privKey, username }, {
    from,
    to,
    amount,
    memo,
    extensions
  }) {
    return deipRpc.broadcast.transferAsync(
      privKey,
      from,
      to,
      amount,
      memo,
      extensions || []
    );
  }

  getAssetById(id) {
    return deipRpc.api.getAssetAsync(id);
  }

  getAssetBySymbol(symbol) {
    return deipRpc.api.getAssetBySymbolAsync(symbol);
  }

  getAssetsByIssuer(issuer) {
    return deipRpc.api.getAssetsByIssuerAsync(issuer);
  }
  
  getAccountAssetBalance(owner, symbol) {
    return deipRpc.api.getAccountAssetBalanceAsync(owner, symbol);
  }

  getAccountAssetsBalancesByOwner(owner) {
    return deipRpc.api.getAccountAssetsBalancesAsync(owner);
  }

  getAccountsAssetBalancesByAsset(symbol) {
    return deipRpc.api.getAccountsAssetBalancesByAssetAsync(symbol);
  }

}

export {
  AssetsService
};
