import { HttpService } from '@deip/http-service';
import { Singleton } from '@deip/toolbox';

class DomainsHttp extends Singleton {
  http = HttpService.getInstance();

  getAllDomains() {
    return this.http.get('/api/v2/domains');
  }

  getDomainsByProject(projectId) {
    return this.http.get(`/api/v2/domains/project/${projectId}`);
  }
}

export {
  DomainsHttp
};
