import { HttpService } from '@deip/http-service';
import { createInstanceGetter } from '@deip/toolbox';

export class ProjectContentHttp {
  http = HttpService.getInstance();

  async getDraft(draftId) {
    return this.http.get(`/api/v2/project-content/draft/${draftId}`);
  }

  async getProjectContentRef(refId) {
    return this.http.get(`/api/v2/project-content/ref/${refId}`);
  }

  async getProjectContent(externalId) {
    return this.http.get(`/api/v2/project-content/${externalId}`);
  }

  async getProjectContentsByProject(projectId) {
    return this.http.get(`/api/v2/project-content/project/${projectId}`);
  }

  async publishProjectContent(req) {
    return this.http.post('/api/v2/project-content/ref/publish', req.getHttpBody(), { headers: req.getHttpHeaders() });
  }

  async getDraftsByProject(projectId) {
    return this.http.get(`/api/v2/project-content/drafts/project/${projectId}`);
  }

  async createProjectContentDraft(req) {
    return this.http.post('/api/v2/project-content/texture', req.getHttpBody(), { headers: req.getHttpHeaders() });
  }

  async updateProjectContentDraft(req) {
    return this.http.put('/api/v2/project-content/texture', req.getHttpBody(), { headers: req.getHttpHeaders() });
  }

  async deleteProjectContentDraft(req) {
    return this.http.put('/api/v2/project-content/draft/delete', req.getHttpBody(), { headers: req.getHttpHeaders() });
  }

  async unlockProjectContentDraft(req) {
    return this.http.put('/api/v2/project-content/draft/unlock', req.getHttpBody(), { headers: req.getHttpHeaders() });
  }

  async getProjectContentsByTenant(tenantId) {
    return this.http.get(`/api/v2/project-content/tenant/${tenantId}`);
  }

  async getPublicProjectContentListing() {
    return this.http.get('/api/v2/project-content/listing');
  }

  async getProjectContentReferencesGraph(contentId) {
    return this.http.get(`/api/v2/project-content/ref/graph/${contentId}`);
  }

  /** @type {() => ProjectContentHttp} */
  static getInstance = createInstanceGetter(ProjectContentHttp);
}
