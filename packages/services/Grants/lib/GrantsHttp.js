import { HttpService } from '@deip/http-service';
import { Singleton } from '@deip/toolbox';

class GrantsHttp extends Singleton {
  http = HttpService.getInstance();

  getApplicationPackageRef(agency, foaId, hash) {
    return this.http.get(`/applications/refs/${agency}/${foaId}/${hash}`);
  }

  getApplicationsRefsByResearch(researchId) {
    return this.http.get(`/applications/refs/research/${researchId}`);
  }

  getApplicationsRefsByFoa(foaId) {
    return this.http.get(`/applications/refs/foa/${foaId}`);
  }
}

export {
  GrantsHttp
};
