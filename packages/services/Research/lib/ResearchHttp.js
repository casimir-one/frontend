import { HttpService } from '@deip/http-service';
import { Singleton } from '@deip/toolbox';

class ResearchHttp extends Singleton {
  http = HttpService.getInstance();

  createResearch({ tx, offchainMeta, isProposal }) {
    return this.http.post('/api/research', { tx, offchainMeta, isProposal });
  }

  createResearchTokenSale({ tx, offchainMeta, isProposal }) {
    return this.http.post('/api/research/token-sale', { tx, offchainMeta, isProposal });
  }

  contributeResearchTokenSale({ tx, isProposal }) {
    return this.http.post('/api/research/token-sale/contribution', { tx, isProposal });
  }

  getResearch(researchId) {
    return this.http.get(`/api/research/${researchId}`);
  }

  updateResearch({ tx, isProposal }) {
    return this.http.put(`/api/research`, { tx, isProposal });
  }

  updateResearchMeta(researchExternalId, update) {
    return this.http.put(`/api/research/meta/${researchExternalId}`, update);
  }
}

export {
  ResearchHttp
};
