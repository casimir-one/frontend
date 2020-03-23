import { Singleton } from '@deip/toolbox';
import { GrantsHttp } from './GrantsHttp';
import deipRpc from '@deip/rpc-client';

class GrantsService extends Singleton {
  grantsHttp = GrantsHttp.getInstance();

  createGrantContract(privKey, {
    grantor,
    amount,
    type,
    target_disciplines,
    details
  }) {
    return deipRpc.broadcast.createGrantAsync(
      privKey, 
      grantor, 
      amount, 
      type, 
      target_disciplines,
      details);
  }

  getFundingOpportunityAnnouncement(id) {
    return deipRpc.api.getFundingOpportunityAnnouncementAsync(id);
  }

  getFundingOpportunityAnnouncementByNumber(number) {
    return deipRpc.api.getFundingOpportunityAnnouncementByNumberAsync(number);
  }

  getFundingOpportunityAnnouncementsByGrantor(names) {
    return deipRpc.api.getFundingOpportunityAnnouncementsByGrantorAsync(names);
  }

  getFundingOpportunityAnnouncementsByOrganization(researchGroupId) {
    return deipRpc.api.getFundingOpportunityAnnouncementsByOrganizationAsync(researchGroupId);
  }

  getFundingOpportunityAnnouncementsListing(page, limit) {
    return deipRpc.api.getFundingOpportunityAnnouncementsListingAsync(page, limit);
  }

  getGrantWithAnnouncedApplicationWindow(id) {
    return deipRpc.api.getGrantWithAnnouncedApplicationWindowAsync(id);
  }

  getGrantsWithAnnouncedApplicationWindowByGrantor(grantor) {
    return deipRpc.api.getGrantsWithAnnouncedApplicationWindowByGrantorAsync(grantor);
  }

  getGrantApplication(id) {
    return deipRpc.api.getGrantApplicationAsync(id);
  }

  getGrantApplicationsByGrant(grantId) {
    return deipRpc.api.getGrantApplicationsByGrantAsync(grantId);
  }

  getGrantApplicationsByResearchId(researchId) {
    return deipRpc.api.getGrantApplicationsByResearchIdAsync(researchId);
  }

  getApplicationPackageRef(agency, foaId, hash) {
    return this.grantsHttp.getApplicationPackageRef(agency, foaId, hash);
  }

  getApplicationsRefsByResearch(researchId) {
    return this.grantsHttp.getApplicationsRefsByResearch(researchId);
  }
}

export {
  GrantsService
};
