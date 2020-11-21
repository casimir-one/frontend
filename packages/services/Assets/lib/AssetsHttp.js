import { HttpService } from '@deip/http-service';
import { Singleton } from '@deip/toolbox';

class AssetsHttp extends Singleton {
  http = HttpService.getInstance();

  transferAssets({ tx }) {
    return this.http.post(`/api/assets/transfer`, { tx });
  }

  createAssetsTransferProposal({ tx }) {
    return this.http.post(`/api/assets/transfer`, { tx });
  }

  createAssetsExchangeProposal({ tx }) {
    return this.http.post(`/api/assets/exchange`, { tx });
  }
}

export {
  AssetsHttp
};
