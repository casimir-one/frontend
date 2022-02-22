import { HttpService } from '@deip/http-service';
import { createInstanceGetter } from '@deip/toolbox';

/**
 * Domains HTTP transport
 */
export class DomainsHttp {
  http = HttpService.getInstance();

  /**
   * Get domains
   * @returns {Promise<Object>}
   */
  async getList() {
    return this.http.get('/api/v2/domains');
  }

  /**
   * Get domains by project id
   * @param {string} projectId
   * @returns {Promise<Object>}
   */
  async getListByProject(projectId) {
    return this.http.get(`/api/v2/domains/project/${projectId}`);
  }

  /** @type {() => DomainsHttp} */
  static getInstance = createInstanceGetter(DomainsHttp)
}
