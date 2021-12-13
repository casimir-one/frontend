import { HttpService } from '@deip/http-service';
import { createInstanceGetter } from '@deip/toolbox';

export class DomainsHttp {
  http = HttpService.getInstance();

  async getAllDomains() {
    return this.http.get('/api/v2/domains');
  }

  async getDomainsByProject(projectId) {
    return this.http.get(`/api/v2/domains/project/${projectId}`);
  }

  /** @type {() => DomainsHttp} */
  static getInstance = createInstanceGetter(DomainsHttp)
}
