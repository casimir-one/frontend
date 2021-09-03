import { HttpService } from '@deip/http-service';
import { Singleton } from '@deip/toolbox';

class ProjectContentHttp extends Singleton {
  http = HttpService.getInstance();

  getDraft(draftId) {
    return this.http.get(`/api/v2/project-content/draft/${draftId}`);
  }

  getProjectContentRef(refId) {
    return this.http.get(`/api/v2/project-content/ref/${refId}`);
  }

  getProjectContent(externalId) {
    return this.http.get(`/api/v2/project-content/${externalId}`);
  }

  getProjectContentsByProject(projectId) {
    return this.http.get(`/api/v2/project-content/project/${projectId}`);
  }

  publishProjectContent(req) {
    return this.http.post('/api/v2/project-content/ref/publish', req.getHttpBody(), { headers: req.getHttpHeaders() });
  }

  getProjectContentAndDraftsByProject(projectExternalId) {
    return this.http.get(`/api/v2/project-content/project/${projectExternalId}`);
  }

  getDraftsByProject(projectId) {
    return this.http.get(`/api/v2/project-content/drafts/project/${projectId}`);
  }

  createProjectContentDraft(req) {
    return this.http.post('/api/v2/project-content/texture', req.getHttpBody(), { headers: req.getHttpHeaders() });
  }

  deleteProjectContentDraft(req) {
    return this.http.put('/api/v2/project-content/draft/delete', req.getHttpBody(), { headers: req.getHttpHeaders() });
  }

  unlockDraft(req) {
    return this.http.put('/api/v2/project-content/draft/unlock', req.getHttpBody(), { headers: req.getHttpHeaders() });
  }

  getProjectContentsByTenant(tenantId) {
    return this.http.get(`/api/v2/project-content/tenant/${tenantId}`);
  }

  getPublicProjectContentListing() {
    return this.http.get('/api/v2/project-content/listing');
  }

  getProjectContentReferencesGraph(contentId) {
    return this.http.get(`/api/v2/project-content/ref/graph/${contentId}`);
  }
}

export {
  ProjectContentHttp
};
