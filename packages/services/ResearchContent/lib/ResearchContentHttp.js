import { HttpService } from '@deip/http-service';
import { Singleton } from '@deip/toolbox';

class ResearchContentHttp extends Singleton {
  http = HttpService.getInstance();

  getResearchContentRef(refId) {
    return this.http.get(`/api/research-content/ref/${refId}`);
  }

  getResearchContent(externalId) {
    return this.http.get(`/api/research-content/${externalId}`);
  }

  publishResearchContent({ tx, offchainMeta, isProposal }) {
    return this.http.post('/api/research-content/ref/publish', { tx, offchainMeta, isProposal });
  }

  getResearchContentAndDraftsByResearch(researchExternalId) {
    return this.http.get(`/api/research-content/research/${researchExternalId}`);
  }

  createResearchContentDraftDar(researchExternalId) {
    return this.http.post(`/api/research-content/texture/${researchExternalId}`, {});
  }

  deleteResearchContentDraft(refId) {
    return this.http.delete_(`/api/research-content/ref/${refId}`);
  }

  unlockResearchContentDraft(refId) {
    return this.http.put(`/api/research-content/ref/unlock/${refId}`, {});
  }

  uploadResearchContentPackage(researchExternalId, formData) {
    return this.http.post('/api/research-content/package', formData, {
      headers: {
        'Research-External-Id': researchExternalId,
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  getResearchContentsByTenant(tenantId) {
    return this.http.get(`/api/research-content/tenant/${tenantId}`);
  }

  getPublicResearchContentListing() {
    return this.http.get('/api/research-content/listing');
  }

  getResearchContentReferencesGraph(contentId) {
    return this.http.get(`/api/research-content/ref/graph/${contentId}`);
  }
}

export {
  ResearchContentHttp
};
