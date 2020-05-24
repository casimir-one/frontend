import { HttpService } from '@deip/http-service';
import { Singleton } from '@deip/toolbox';

class ResearchContentHttp extends Singleton {
  http = HttpService.getInstance();

  constructor() {
    super();
  }

  createResearchContent({ tx, offchainMeta, isProposal }) {
    return this.http.post(`/content/publish`, { tx, offchainMeta, isProposal });
  }

  getContentRefById(refId) {
    return this.http.get(`/content/refs/research/content-id/${refId}`);
  }

  getContentRefByHash(researchExternalId, hash) {
    return this.http.get(`/content/refs/research/${researchExternalId}/content-hash/${hash}`);
  }

  getResearchContentByResearch(researchExternalId) {
    return this.http.get(`/content/research/${researchExternalId}`);
  }

  createDarContent(researchExternalId) {
    return this.http.post(`/content/dar/${researchExternalId}`, {});
  }

  deleteContentDraft(refId) {
    return this.http.delete_(`/content/refs/${refId}`);
  }

  unlockContentDraft(refId) {
    return this.http.put(`/content/refs/unlock/${refId}`, {});
  }
}

export {
  ResearchContentHttp
};
