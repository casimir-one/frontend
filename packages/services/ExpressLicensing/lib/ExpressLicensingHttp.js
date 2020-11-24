import { HttpService } from '@deip/http-service';
import { Singleton } from '@deip/toolbox';
import qs from 'qs';

class ExpressLicensingHttp extends Singleton {
  http = HttpService.getInstance();

  createExpressLicensingRequest({ tx, offchainMeta }) {
    return this.http.post(`/api/express-licensing`, { tx, offchainMeta });
  }

}

export {
  ExpressLicensingHttp
};
