import { HttpService } from '@deip/http-service';
import { Singleton } from '@deip/toolbox';

class ResearchHttp extends Singleton {
  http = HttpService.getInstance();

  createResearch({ tx, offchainMeta, isProposal }) {
    return this.http.post('/api/research', { tx, offchainMeta, isProposal });
  }

  createResearchApplication({ proposalId, formData }) {
    return this.http.post(`/api/research/application`, formData, {
      headers: {
        'Proposal-Id': proposalId,
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  getResearchApplications({ status, researcher }) {
    let query = status ? `?status=${status}` : '';
    query = researcher ? query ? `${query}&researcher=${researcher}` : `?researcher=${researcher}` : query;
    return this.http.get(`/api/research/list/applications${query}`);
  }
  
  createResearchTokenSale({ tx, offchainMeta, isProposal }) {
    return this.http.post('/api/research/token-sale', { tx, offchainMeta, isProposal });
  }

  contributeResearchTokenSale({ tx, isProposal }) {
    return this.http.post('/api/research/token-sale/contribution', { tx, isProposal });
  }

  getResearchProfile(researchExternalId) {
    return this.http.get(`/api/research/${researchExternalId}`);
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
