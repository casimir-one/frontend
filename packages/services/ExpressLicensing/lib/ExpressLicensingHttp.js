import { HttpService } from '@deip/http-service';
import { Singleton } from '@deip/toolbox';
import qs from 'qs';

class ExpressLicensingHttp extends Singleton {
  http = HttpService.getInstance();

  createExpressLicensingRequest({ tx, offchainMeta }) {
    return this.http.post(`/api/express-licensing`, { tx, offchainMeta });
  }

  getResearchLicense(externalId) {
    return this.http.get(`/api/express-licensing/externalId/${externalId}`);
  }

  getResearchLicensesByLicensee(licensee) {
    return this.http.get(`/api/express-licensing/licensee/${licensee}`);
  }

  getResearchLicensesByLicenser(licenser) {
    return this.http.get(`/api/express-licensing/licenser/${licenser}`);
  }

  getResearchLicensesByResearch(researchId) {
    return this.http.get(`/api/express-licensing/researchId/${researchId}`);
  }

  getResearchLicensesByLicenseeAndResearch(licensee, researchId) {
    return this.http.get(`/api/express-licensing/licensee/${licensee}/researchId/${researchId}`);
  }

  getResearchLicensesByLicenseeAndLicenser(licensee, licenser) {
    return this.http.get(`/api/express-licensing/licensee/${licensee}/licenser/${licenser}`);
  }
}

export {
  ExpressLicensingHttp
};
