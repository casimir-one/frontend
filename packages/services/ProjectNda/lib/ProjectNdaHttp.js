import { HttpService } from '@deip/http-service';
import { Singleton } from '@deip/toolbox';

class ProjectNdaHttp extends Singleton {
  http = HttpService.getInstance();

  createProjectNda(req) {
    return this.http.post('/api/v2/nda', req.getHttpBody());
  }

  getProjectNda(ndaExternalId) {
    return this.http.get(`/api/v2/nda/${ndaExternalId}`);
  }

  getProjectNdaListByCreator(creator) {
    return this.http.get(`/api/v2/nda/creator/${creator}`);
  }

  getProjectNdaListByProject(projectId) {
    return this.http.get(`/api/v2/nda/project/${projectId}`);
  }
}

export {
  ProjectNdaHttp
};
