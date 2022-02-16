import { HttpService } from '@deip/http-service';
import { createInstanceGetter } from '@deip/toolbox';

export class ProjectContentHttp {
  http = HttpService.getInstance();

  async getDraft(draftId) {
    return this.http.get(`/api/v2/project-content/draft/${draftId}`);
  }

  async getContentRef(refId) {
    return this.http.get(`/api/v2/project-content/ref/${refId}`);
  }

  async getContent(projectContentid) {
    return this.http.get(`/api/v2/project-content/${projectContentid}`);
  }

  async getContentListByProject(projectId) {
    return this.http.get(`/api/v2/project-content/project/${projectId}`);
  }

  async publishContent(req) {
    return this.http.post('/api/v2/project-content/ref/publish', req.getHttpBody(), { headers: req.getHttpHeaders() });
  }

  async getDraftsByProject(projectId) {
    return this.http.get(`/api/v2/project-content/drafts/project/${projectId}`);
  }

  async createDraft(req) {
    return this.http.post('/api/v2/project-content/texture', req.getHttpBody(), { headers: req.getHttpHeaders() });
  }

  async updateDraft(req) {
    return this.http.put('/api/v2/project-content/texture', req.getHttpBody(), { headers: req.getHttpHeaders() });
  }

  async deleteDraft(req) {
    return this.http.put('/api/v2/project-content/draft/delete', req.getHttpBody(), { headers: req.getHttpHeaders() });
  }

  async unlockDraft(req) {
    return this.http.put('/api/v2/project-content/draft/unlock', req.getHttpBody(), { headers: req.getHttpHeaders() });
  }

  async getContentListByPortal(portalId) {
    return this.http.get(`/api/v2/project-content/portal/${portalId}`);
  }

  async getPublicContentList() {
    return this.http.get('/api/v2/project-content/listing');
  }

  async getContentReferencesGraph(contentId) {
    return this.http.get(`/api/v2/project-content/ref/graph/${contentId}`);
  }

  /** @type {() => ProjectContentHttp} */
  static getInstance = createInstanceGetter(ProjectContentHttp);
}
