import { Singleton } from '@deip/toolbox';
import { ProjectService } from '@deip/project-service';
import { proxydi } from '@deip/proxydi';
import { ExpressLicensingHttp } from './ExpressLicensingHttp';

class ExpressLicensingService extends Singleton {
  expressLicensingHttp = ExpressLicensingHttp.getInstance();

  projectService = ProjectService.getInstance();

  proxydi = proxydi;

  createExpressLicensingRequest() {
    // Will be recovered by Egor Anekey's PR
  }

  getResearchLicense(externalId) {
    return this.expressLicensingHttp.getResearchLicense(externalId);
  }

  getResearchLicensesByLicensee(licensee) {
    return this.expressLicensingHttp.getResearchLicensesByLicensee(licensee);
  }

  getResearchLicensesByLicenser(licenser) {
    return this.expressLicensingHttp.getResearchLicensesByLicenser(licenser);
  }

  getResearchLicensesByResearch(researchId) {
    return this.expressLicensingHttp.getResearchLicensesByResearch(researchId);
  }

  getResearchLicensesByLicenseeAndResearch(licensee, researchId) {
    return this.expressLicensingHttp.getResearchLicensesByLicenseeAndResearch(licensee, researchId);
  }

  getResearchLicensesByLicenseeAndLicenser(licensee, licenser) {
    return this.expressLicensingHttp.getResearchLicensesByLicenseeAndLicenser(licensee, licenser);
  }
}

export {
  ExpressLicensingService
};
