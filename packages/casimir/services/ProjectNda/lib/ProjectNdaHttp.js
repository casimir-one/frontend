import { HttpService } from '@deip/http-service';
import { createInstanceGetter } from '@deip/toolbox';

export class ProjectNdaHttp {
  http = HttpService.getInstance();

  async createProjectNda(req) {
    return this.http.post('/api/v2/nda', req.getHttpBody());
  }

  async getProjectNda(ndaExternalId) {
    return this.http.get(`/api/v2/nda/${ndaExternalId}`);
  }

  async getProjectNdaListByCreator(creator) {
    return this.http.get(`/api/v2/nda/creator/${creator}`);
  }

  async getProjectNdaListByProject(projectId) {
    return this.http.get(`/api/v2/nda/project/${projectId}`);
  }

  /** @type {() => ProjectNdaHttp} */
  static getInstance = createInstanceGetter(ProjectNdaHttp);
}