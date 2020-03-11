import deipRpc from '@deip/deip-oa-rpc-client';

import { Singleton } from '@deip/toolbox';
import { AppConfigService } from '@deip/app-config-service';

class ConfigMiddleware extends Singleton {
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
}

export { ConfigMiddleware };
