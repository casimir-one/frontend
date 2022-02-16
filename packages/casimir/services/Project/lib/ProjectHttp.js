import { HttpService, serializeParams } from '@deip/http-service';
import { createInstanceGetter } from '@deip/toolbox';

export class ProjectHttp {
  http = HttpService.getInstance();

  async getOne(projectId) {
    return this.http.get(`/api/v2/project/${projectId}`);
  }

  async getListByIds(projectsIds) {
    const query = serializeParams({ projectsIds });
    return this.http.get(`/api/v2/projects?${query}`);
  }

  async getTeamDefaultProject(teamId) {
    return this.http.get(`/api/v2/project/default/${teamId}`);
  }

  async create(req) {
    return this.http.post('/api/v2/project', req.getHttpBody(), { headers: req.getHttpHeaders() });
  }

  async update(req) {
    return this.http.put('/api/v2/project', req.getHttpBody(), { headers: req.getHttpHeaders() });
  }

  async delete(req) {
    return this.http.put('/api/v2/project/delete', req.getHttpBody(), { headers: req.getHttpHeaders() });
  }

  async getPublicProjectList(filter) {
    const query = serializeParams({ filter });
    return this.http.get(`/api/v2/projects/listing?${query}`);
  }

  async getUserProjectList(username) {
    return this.http.get(`/api/v2/projects/user/listing/${username}`);
  }

  async getTeamProjectList(teamId) {
    return this.http.get(`/api/v2/projects/team/listing/${teamId}`);
  }

  async getPortalProjectList() {
    return this.http.get('/api/v2/projects/portal/listing');
  }

  /** @type {() => ProjectHttp} */
  static getInstance = createInstanceGetter(ProjectHttp);
}
