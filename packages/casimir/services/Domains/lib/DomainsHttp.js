import { HttpService } from '@deip/http-service';
import { createInstanceGetter } from '@deip/toolbox';

export class DomainsHttp {
  http = HttpService.getInstance();

  async getList() {
    return this.http.get('/api/v2/domains');
  }

  async getListByProject(projectId) {
    return this.http.get(`/api/v2/domains/project/${projectId}`);
  }

  /** @type {() => DomainsHttp} */
  static getInstance = createInstanceGetter(DomainsHttp)
}
