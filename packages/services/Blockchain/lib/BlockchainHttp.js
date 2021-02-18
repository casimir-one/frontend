import { HttpService } from '@deip/http-service';
import { Singleton } from '@deip/toolbox';

class BlockchainHttp extends Singleton {
  http = HttpService.getInstance();

  constructor() {
    super();
  }

  signTxByTenant(tx) {
    return this.http.post(`/api/infrastructure/tenant/sign`, { tx });
  }
}

export {
  BlockchainHttp
};
