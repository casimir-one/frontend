import { HttpService } from '@deip/http-service';
import { Singleton } from '@deip/toolbox';

class ContractAgreementHttp extends Singleton {
  http = HttpService.getInstance();

  createContractAgreement(req) {
    return this.http.post('/api/v2/contract-agreement', req.getHttpBody());
  }

  acceptContractAgreement(req) {
    return this.http.post('/api/v2/contract-agreement/accept', req.getHttpBody());
  }

  proposeContractAgreement(req) {
    return this.http.post('/api/v2/contract-agreement', req.getHttpBody());
  }

  getProjectLicense(licenseId) {
    return this.http.get(`/api/v2/contract-agreement/license/${licenseId}`);
  }

  getProjectLicensesByLicensee(licensee) {
    return this.http.get(`/api/v2/contract-agreement/licenses/licensee/${licensee}`);
  }

  getProjectLicensesByLicenser(licenser) {
    return this.http.get(`/api/v2/contract-agreement/licenses/licenser/${licenser}`);
  }

  getProjectLicensesByProject(projectId) {
    return this.http.get(`/api/v2/contract-agreement/licenses/projectId/${projectId}`);
  }

  getProjectLicensesByLicenseeAndProject(licensee, projectId) {
    return this.http.get(`/api/v2/contract-agreement/licenses/licensee/${licensee}/projectId/${projectId}`);
  }

  getProjectLicensesByLicenseeAndLicenser(licensee, licenser) {
    return this.http.get(`/api/v2/contract-agreement/licenses/licensee/${licensee}/licenser/${licenser}`);
  }

  getContractAgreementsListByCreator(creator) {
    return this.http.get(`/api/v2/contract-agreements/creator/${creator}`);
  }

  getIncomeShareAgreement(incomeShareAgreementId) {
    return this.http.get(`/api/v2/contract-agreement/isa/${incomeShareAgreementId}`);
  }

  getIncomeShareAgreementsListByCreator(creator) {
    return this.http.get(`/api/v2/contract-agreement/isas/creator/${creator}`);
  }
}

export {
  ContractAgreementHttp
};
