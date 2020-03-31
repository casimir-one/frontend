import { Singleton } from '@deip/toolbox';
import { GrantsHttp } from './GrantsHttp';
import deipRpc from '@deip/rpc-client';

class GrantsService extends Singleton {
  grantsHttp = GrantsHttp.getInstance();

  createGrantContract(privKey, {
    grantor,
    amount,
    targetDisciplines,
    distributionModel,
    extensions
  }) {
    return deipRpc.broadcast.createGrantAsync(
      privKey, 
      grantor, 
      amount, 
      targetDisciplines,
      distributionModel,
      extensions);
  }

  createFundingOpportunityAward(privKey, {
    fundingOpportunityId,
    creator,
    awardees,
    award,
    extensions
  }) {
    return deipRpc.broadcast.createAwardAsync(
      privKey,
      fundingOpportunityId,
      creator,
      awardees,
      award,
      extensions);
  }

  getFundingOpportunityAnnouncement(id) {
    return deipRpc.api.getFundingOpportunityAnnouncementAsync(id);
  }

  getFundingOpportunityAnnouncementByNumber(number) {
    return deipRpc.api.getFundingOpportunityAnnouncementByNumberAsync(number);
  }

  getFundingOpportunityAnnouncementsByOrganization(researchGroupId) {
    return deipRpc.api.getFundingOpportunityAnnouncementsByOrganizationAsync(researchGroupId);
  }

  getFundingOpportunityAnnouncementsListing(page, limit) {
    return deipRpc.api.getFundingOpportunityAnnouncementsListingAsync(page, limit);
  }

  getAward(id) {
    return deipRpc.api.getAwardAsync(id);
  }

  getAwardsByFundingOpportunity(foaNum) {
    return deipRpc.api.getAwardsByFundingOpportunityAsync(foaNum);
  }

  getAwardRecipient(id) {
    return deipRpc.api.getAwardRecipientAsync(id);
  }

  getAwardRecipientsByAward(awardId) {
    return deipRpc.api.getAwardRecipientsByAwardAsync(awardId);
  }

  getAwardRecipientsByAccount(awardee) {
    return deipRpc.api.getAwardRecipientsByAccountAsync(awardee);
  }

  getAwardRecipientsByFundingOpportunity(foaNum) {
    return deipRpc.api.getAwardRecipientsByFundingOpportunityAsync(foaNum);
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
