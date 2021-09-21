import { AccessService } from '@deip/access-service';
import { Singleton } from '@deip/toolbox';
import { DomainsHttp } from './DomainsHttp';

class DomainsService extends Singleton {
  accessService = AccessService.getInstance();

  domainsHttp = DomainsHttp.getInstance();

  getAllDomains() {
    return this.domainsHttp.getAllDomains();
  }

  getDomainsByProject(projectId) {
    return this.domainsHttp.getDomainsByProject(projectId);
  }
}

export {
  DomainsService
};
