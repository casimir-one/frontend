import { Singleton } from '@deip/toolbox';
import { ResearchContentHttp } from './ResearchContentHttp';

class ResearchContentService extends Singleton {
  researchContentHttp = ResearchContentHttp.getInstance();

  getContentRefById(refId) {
    return this.researchContentHttp.getContentRefById(refId);
  }

  getContentRefByHash(researchId, hash) {
    return this.researchContentHttp.getContentRefByHash(researchId, hash);
  }

  getContentRefs(researchId) {
    return this.researchContentHttp.getContentRefs(researchId);
  }

  createDarContent(researchId) {
    return this.researchContentHttp.createDarContent(researchId);
  }

  deleteContentDraft(refId) {
    return this.researchContentHttp.deleteContentDraft(refId);
  }

  unlockContentDraft(refId) {
    return this.researchContentHttp.unlockContentDraft(refId);
  }
}

export {
  ResearchContentService
};
