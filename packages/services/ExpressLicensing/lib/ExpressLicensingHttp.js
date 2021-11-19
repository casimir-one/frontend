import { HttpService } from '@deip/http-service';
import { createInstanceGetter } from '@deip/toolbox';

export class ExpressLicensingHttp {
  http = HttpService.getInstance();

  async createExpressLicensingRequest({ tx, offchainMeta }) {
    return this.http.post('/api/express-licensing', { tx, offchainMeta });
  }

  async getResearchLicense(externalId) {
    return this.http.get(`/api/express-licensing/externalId/${externalId}`);
  }

  async getResearchLicensesByLicensee(licensee) {
    return this.http.get(`/api/express-licensing/licensee/${licensee}`);
  }

  async getResearchLicensesByLicenser(licenser) {
    return this.http.get(`/api/express-licensing/licenser/${licenser}`);
  }

  async getResearchLicensesByResearch(researchId) {
    return this.http.get(`/api/express-licensing/researchId/${researchId}`);
  }

  async getResearchLicensesByLicenseeAndResearch(licensee, researchId) {
    return this.http.get(`/api/express-licensing/licensee/${licensee}/researchId/${researchId}`);
  }

  async getResearchLicensesByLicenseeAndLicenser(licensee, licenser) {
    return this.http.get(`/api/express-licensing/licensee/${licensee}/licenser/${licenser}`);
  }

  /** @type {() => ExpressLicensingHttp} */
  static getInstance = createInstanceGetter(ExpressLicensingHttp);
}
