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
    awardNumber,
    award,
    awardee,
    researchId,
    universityId,
    universityOverhead,
    subawardees,
    creator,
    extensions
  }) {
    return deipRpc.broadcast.createAwardAsync(
      privKey,
      fundingOpportunityId,
      awardNumber,
      award,
      awardee,
      researchId,
      universityId,
      universityOverhead,
      subawardees,
      creator,
      extensions);
  }

  approveFundingOpportunityAward(privKey, {
    awardNumber,
    approver
  }) {
    return deipRpc.broadcast.approveAwardAsync(
      privKey,
      awardNumber,
      approver);
  }

  rejectFundingOpportunityAward(privKey, {
    awardNumber,
    rejector
  }) {
    return deipRpc.broadcast.rejectAwardAsync(
      privKey,
      awardNumber,
      rejector);
  }

  createAwardWithdrawalRequest(privKey, {
    paymentNumber,
    awardNumber,
    subawardNumber,
    requester,
    amount,
    description,
    attachment
  }) {
    return deipRpc.broadcast.createAwardWithdrawalRequestAsync(
      privKey,
      paymentNumber,
      awardNumber,
      subawardNumber,
      requester,
      amount,
      description,
      attachment);
  }

  certifyAwardWithdrawalRequest(privKey, {
    paymentNumber,
    awardNumber,
    subawardNumber,
    certifier
  }) {
    return deipRpc.broadcast.certifyAwardWithdrawalRequestAsync(
      privKey,
      paymentNumber,
      awardNumber,
      subawardNumber,
      certifier);
  }

  approveAwardWithdrawalRequest(privKey, {
    paymentNumber,
    awardNumber,
    subawardNumber,
    approver
  }) {
    return deipRpc.broadcast.approveAwardWithdrawalRequestAsync(
      privKey,
      paymentNumber,
      awardNumber,
      subawardNumber,
      approver);
  }

  rejectAwardWithdrawalRequest(privKey, {
    paymentNumber,
    awardNumber,
    subawardNumber,
    rejector
  }) {
    return deipRpc.broadcast.rejectAwardWithdrawalRequestAsync(
      privKey,
      paymentNumber,
      awardNumber,
      subawardNumber,
      rejector);
  }

  payAwardWithdrawalRequest(privKey, {
    paymentNumber,
    awardNumber,
    subawardNumber,
    payer
  }) {
    return deipRpc.broadcast.payAwardWithdrawalRequestAsync(
      privKey,
      paymentNumber,
      awardNumber,
      subawardNumber,
      payer);
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

  getAwardWithdrawalRequest(awardNumber, paymentNumber) {
    return deipRpc.api.getAwardWithdrawalRequestAsync(awardNumber, paymentNumber);
  }

  getAwardWithdrawalRequestsByAward(awardNumber) {
    return deipRpc.api.getAwardWithdrawalRequestsByAwardAsync(awardNumber);
  }

  getAwardWithdrawalRequestsByAwardAndSubaward(awardNumber, subawardNumber) {
    return deipRpc.api.getAwardWithdrawalRequestsByAwardAndSubawardAsync(awardNumber, subawardNumber);
  }

  getAwardWithdrawalRequestsByAwardAndStatus(awardNumber, status) {
    return deipRpc.api.getAwardWithdrawalRequestsByAwardAndStatusAsync(awardNumber, status);
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
