import { HttpService } from '@deip/http-service';
import { Singleton } from '@deip/toolbox';
import qs from 'qs';

class ExpressLicensingHttp extends Singleton {
  http = HttpService.getInstance();

  createExpressLicensingRequest({ tx, offchainMeta }) {
    return this.http.post(`/api/express-licensing`, { tx, offchainMeta });
  }

  approveExpressLicensingRequest({ requestId, tx, offchainMeta }) {
    return this.http.put(`/api/express-licensing/approve/${requestId}`, { tx, offchainMeta });
  }

  rejectExpressLicensingRequest({ requestId, tx, offchainMeta }) {
    return this.http.put(`/api/express-licensing/reject/${requestId}`, { tx, offchainMeta });
  }
  
}

export {
  ExpressLicensingHttp
};
