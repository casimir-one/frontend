import { ProjectService } from '@deip/project-service';
import { proxydi } from '@deip/proxydi';
import { createInstanceGetter } from '@deip/toolbox';
import { ExpressLicensingHttp } from './ExpressLicensingHttp';

export class ExpressLicensingService {
  expressLicensingHttp = ExpressLicensingHttp.getInstance();

  projectService = ProjectService.getInstance();

  proxydi = proxydi;

  async createExpressLicensingRequest() {
    // Will be recovered by Egor Anekey's PR
  }

  async getResearchLicense(externalId) {
    return this.expressLicensingHttp.getResearchLicense(externalId);
  }

  async getResearchLicensesByLicensee(licensee) {
    return this.expressLicensingHttp.getResearchLicensesByLicensee(licensee);
  }

  async getResearchLicensesByLicenser(licenser) {
    return this.expressLicensingHttp.getResearchLicensesByLicenser(licenser);
  }

  async getResearchLicensesByResearch(researchId) {
    return this.expressLicensingHttp.getResearchLicensesByResearch(researchId);
  }

  async getResearchLicensesByLicenseeAndResearch(licensee, researchId) {
    return this.expressLicensingHttp.getResearchLicensesByLicenseeAndResearch(licensee, researchId);
  }

  async getResearchLicensesByLicenseeAndLicenser(licensee, licenser) {
    return this.expressLicensingHttp.getResearchLicensesByLicenseeAndLicenser(licensee, licenser);
  }

  /** @type {() => ExpressLicensingService} */
  static getInstance = createInstanceGetter(ExpressLicensingService);
}
