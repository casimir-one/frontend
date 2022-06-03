import { AccessService } from '@deip/access-service';
import { makeSingletonInstance } from '@deip/toolbox';
import { DomainsHttp } from './DomainsHttp';

/**
 * Domains data transport
 */
export class DomainsService {
  accessService = AccessService.getInstance();

  domainsHttp = DomainsHttp.getInstance();

  /**
   * Get domains
   * @returns {Promise<Object>}
   */
  async getList() {
    return this.domainsHttp.getList();
  }

  /**
   * Get domains by project id
   * @param {string} projectId
   * @returns {Promise<Object>}
   */
  async getListByProject(projectId) {
    return this.domainsHttp.getListByProject(projectId);
  }

  /** @type {() => DomainsService} */
  static getInstance = makeSingletonInstance(() => new DomainsService());
}
