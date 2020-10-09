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

  getExpressLicensingRequests() {
    return this.http.get(`/api/express-licensing/all`);
  }

  getExpressLicensingRequestsByStatus(status) {
    return this.http.get(`/api/express-licensing/status/${status}`);
  }

  getExpressLicensingRequestById(requestId) {
    return this.http.get(`/api/express-licensing/id/${requestId}`);
  }

  getExpressLicensingRequestsByResearch(researchExternalId) {
    return this.http.get(`/api/express-licensing/research/${researchExternalId}`);
  }

  getExpressLicensingRequestsByRequester(requester) {
    return this.http.get(`/api/express-licensing/requester/${requester}`);
  }

}

export {
  ExpressLicensingHttp
};
