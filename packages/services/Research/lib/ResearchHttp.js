import { HttpService } from '@deip/http-service';
import { Singleton } from '@deip/toolbox';
import qs from 'qs';

class ResearchHttp extends Singleton {
  http = HttpService.getInstance();

  getResearch(externalId) {
    return this.http.get(`/api/research/${externalId}`);
  }
  
  getPublicResearchListing(filter) {
    let query = qs.stringify({ filter });
    return this.http.get(`/api/research/listing?${query}`);
  }

  getUserResearchListing(username) {
    return this.http.get(`/api/research/user/listing/${username}`);
  }

  getResearchGroupResearchListing(researchGroupExternalId) {
    return this.http.get(`/api/research/group/listing/${researchGroupExternalId}`);
  }

  createResearch({ tx, offchainMeta }) {
    return this.http.post('/api/research', { tx, offchainMeta });
  }

  createResearchApplication({ proposalId, formData }) {
    return this.http.post(`/api/research/application`, formData, {
      headers: {
        'Proposal-Id': proposalId,
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  editResearchApplication({ proposalId, formData }) {
    return this.http.put(`/api/research/application/${proposalId}`, formData, {
      headers: {
        'Proposal-Id': proposalId,
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  approveResearchApplication({ tx }) {
    return this.http.post('/api/research/application/approve', { tx });
  }

  rejectResearchApplication({ tx }) {
    return this.http.post('/api/research/application/reject', { tx });
  }

  deleteResearchApplication({ tx }) {
    return this.http.post('/api/research/application/delete', { tx });
  }  

  getResearchApplications({ status, researcher }) {
    let query = status ? `?status=${status}` : '';
    query = researcher ? query ? `${query}&researcher=${researcher}` : `?researcher=${researcher}` : query;
    return this.http.get(`/api/research/application/list${query}`);
  }
  
  createResearchTokenSale({ tx, isProposal, offchainMeta }) {
    return this.http.post('/api/research/token-sale', { tx, isProposal, offchainMeta });
  }

  contributeResearchTokenSale({ tx, isProposal }) {
    return this.http.post('/api/research/token-sale/contribution', { tx, isProposal });
  }

  updateResearch({ tx, offchainMeta }) {
    return this.http.put(`/api/research`, { tx, offchainMeta });
  }

  getResearchPendingInvites(researchExternalId) {
    return this.http.get(`/api/invites/research/${researchExternalId}`);
  }
  
}

export {
  ResearchHttp
};
