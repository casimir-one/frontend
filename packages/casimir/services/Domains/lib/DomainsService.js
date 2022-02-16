import { AccessService } from '@deip/access-service';
import { createInstanceGetter } from '@deip/toolbox';
import { DomainsHttp } from './DomainsHttp';

export class DomainsService {
  accessService = AccessService.getInstance();

  domainsHttp = DomainsHttp.getInstance();

  async getList() {
    return this.domainsHttp.getList();
  }

  async getListByProject(projectId) {
    return this.domainsHttp.getListByProject(projectId);
  }

  /** @type {() => DomainsService} */
  static getInstance = createInstanceGetter(DomainsService);
}
