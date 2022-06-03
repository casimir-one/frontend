import { HttpService } from '@deip/http-service';
import { makeSingletonInstance } from '@deip/toolbox';

export class ProjectNdaHttp {
  http = HttpService.getInstance();

  async createProjectNda(req) {
    return this.http.post('/api/v2/nda', req.getHttpBody());
  }

  async getProjectNda(ndaId) {
    return this.http.get(`/api/v2/nda/${ndaId}`);
  }

  async getProjectNdaListByCreator(creator) {
    return this.http.get(`/api/v2/nda/creator/${creator}`);
  }

  async getProjectNdaListByProject(projectId) {
    return this.http.get(`/api/v2/nda/project/${projectId}`);
  }

  /** @type {() => ProjectNdaHttp} */
  static getInstance = makeSingletonInstance(() => new ProjectNdaHttp());
}
