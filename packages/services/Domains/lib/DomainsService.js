import { AccessService } from '@deip/access-service';
import { createInstanceGetter } from '@deip/toolbox';
import { DomainsHttp } from './DomainsHttp';

export class DomainsService {
  accessService = AccessService.getInstance();

  domainsHttp = DomainsHttp.getInstance();

  async getAllDomains() {
    return this.domainsHttp.getAllDomains();
  }

  async getDomainsByProject(projectId) {
    return this.domainsHttp.getDomainsByProject(projectId);
  }

  /** @type {() => DomainsService} */
  static getInstance = createInstanceGetter(DomainsService);
}
