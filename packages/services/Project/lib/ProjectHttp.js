import { HttpService, serializeParams } from '@deip/http-service';
import { createInstanceGetter } from '@deip/toolbox';

export class ProjectHttp {
  http = HttpService.getInstance();

  async getProject(projectId) {
    return this.http.get(`/api/v2/project/${projectId}`);
  }

  async getProjects(projectsIds) {
    const query = serializeParams({ projectsIds });
    return this.http.get(`/api/v2/projects?${query}`);
  }

  async getTeamDefaultProject(teamId) {
    return this.http.get(`/api/v2/project/default/${teamId}`);
  }

  async createProject(req) {
    return this.http.post('/api/v2/project', req.getHttpBody(), { headers: req.getHttpHeaders() });
  }

  async updateProject(req) {
    return this.http.put('/api/v2/project', req.getHttpBody(), { headers: req.getHttpHeaders() });
  }

  async deleteProject(req) {
    return this.http.put(`/api/v2/project/delete`, req.getHttpBody(), { headers: req.getHttpHeaders() });
  }

  async getPublicProjectListing(filter) {
    let query = serializeParams({ filter });
    return this.http.get(`/api/v2/projects/listing?${query}`);
  }

  async getUserProjectListing(username) {
    return this.http.get(`/api/v2/projects/user/listing/${username}`);
  }

  async getTeamProjectListing(teamId) {
    return this.http.get(`/api/v2/projects/team/listing/${teamId}`);
  }

  async getTenantProjectListing() {
    return this.http.get(`/api/v2/projects/tenant/listing`);
  }

  /** @type {() => ProjectHttp} */
  static getInstance = createInstanceGetter(ProjectHttp);
}
