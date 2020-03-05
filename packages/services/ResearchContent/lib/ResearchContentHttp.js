import { HttpService } from '@deip/http-service';
import { Singleton } from '@deip/toolbox';

class ResearchContentHttp extends Singleton {
  http = HttpService.getInstance();

  constructor() {
    super();
  }

  getContentRefById(refId) {
    return this.http.get(`/content/refs/research/content-id/${refId}`);
  }

  getContentRefByHash(researchId, hash) {
    return this.http.get(`/content/refs/research/${researchId}/content-hash/${hash}`);
  }

  getContentRefs({ researchId }) {
    return this.http.get(`/content/refs/research/${researchId}`);
  }

  createDarContent(researchId) {
    return this.http.post(`/content/dar/${researchId}`, {});
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
