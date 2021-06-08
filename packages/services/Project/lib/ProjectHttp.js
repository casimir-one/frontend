import { HttpService } from '@deip/http-service';
import { Singleton } from '@deip/toolbox';
import qs from 'qs';

class ProjectHttp extends Singleton {
  http = HttpService.getInstance();


  getProject(projectId) {
    return this.http.get(`/api/v2/project/${projectId}`);
  }

  getProjects(projectsIds) {
    const query = qs.stringify({ projectsIds });
    return this.http.get(`/api/v2/projects?${query}`);
  }

  getTeamDefaultProject(teamId) {
    return this.http.get(`/api/v2/project/default/${teamId}`);
  }

  createProject(req) {
    return this.http.post('/api/v2/project', req.getRequestBody(), { headers: req.getRequestHeaders() });
  }

  getProjectPendingInvites(projectId) {
    return this.http.get(`/api/invites/research/${projectId}`);
  }

  updateProject(req) {
    return this.http.put('/api/v2/project', req.getRequestBody(), { headers: req.getRequestHeaders() });
  }

  deleteProject(req) {
    return this.http.put(`/api/v2/project/delete`, req.getRequestBody(), { headers: req.getRequestHeaders() });
  }
  
}

export {
  ProjectHttp
};
