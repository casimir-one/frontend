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

  approveAssetsTransferProposal({ tx }) {
    return this.http.post(`/api/assets/transfer/approve`, { tx });
  }

  rejectAssetsTransferProposal({ tx }) {
    return this.http.post(`/api/assets/transfer/reject`, { tx });
  }

  createAssetsExchangeProposal({ tx }) {
    return this.http.post(`/api/assets/exchange`, { tx });
  }

  approveAssetsExchangeProposal({ tx }) {
    return this.http.post(`/api/assets/exchange/approve`, { tx });
  }

  rejectAssetsExchangeProposal({ tx }) {
    return this.http.post(`/api/assets/exchange/reject`, { tx });
  }
}

export {
  AssetsHttp
};
