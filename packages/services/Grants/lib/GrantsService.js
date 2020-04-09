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
    fundingOpportunityNumber,
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
      fundingOpportunityNumber,
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

  getFundingOpportunityAnnouncementByNumber(foaNum) {
    return deipRpc.api.getFundingOpportunityAnnouncementByNumberAsync(foaNum);
  }

  getFundingOpportunityAnnouncementsByOrganization(researchGroupId) {
    return deipRpc.api.getFundingOpportunityAnnouncementsByOrganizationAsync(researchGroupId);
  }

  getFundingOpportunityAnnouncementsListing(page, limit) {
    return deipRpc.api.getFundingOpportunityAnnouncementsListingAsync(page, limit);
  }

  getAwardByNumber(awardNumber) {
    return deipRpc.api.getAwardAsync(awardNumber);
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

  getAwardWithdrawalRequestWithOffchain(awardNumber, paymentNumber) {
    return Promise.all([
      deipRpc.api.getAwardWithdrawalRequestAsync(awardNumber, paymentNumber),
      this.grantsHttp.getAwardWithdrawalRequestPackageRef(awardNumber, paymentNumber)
    ])
      .then(([onchain, offchain]) => {
        return {
          ...onchain,
          withdrawalRef: offchain
        }
      });
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

  getWithdrawalRequestsHistoryByAwardNumber(awardNumber) {
    return deipRpc.api.getWithdrawalRequestsHistoryByAwardNumberAsync(awardNumber);
  }

  getWithdrawalRequestHistoryByAwardAndPaymentNumber(awardNumber, paymentNumber) {
    return deipRpc.api.getWithdrawalRequestHistoryByAwardAndPaymentNumberAsync(awardNumber, paymentNumber);
  }

  getWithdrawalRequestsHistoryByAwardAndSubawardNumber(awardNumber, subawardNumber) {
    return deipRpc.api.getWithdrawalRequestsHistoryByAwardAndSubawardNumberAsync(awardNumber, subawardNumber);
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

  findAwardSubawardees(item, all) {
    let descendants = all.filter(d => d.source == item.awardee && d.award_number == item.award_number);
    for (let i = 0; i < descendants.length; i++) {
      let sub_descendants = this.findAwardSubawardees(descendants[i], all);
      let filtered = sub_descendants.filter(d => !descendants.some(sub_desc => sub_desc.award_number == d.award_number && sub_desc.subaward_number == d.subaward_number));
      descendants.push(...filtered);
    }
    return descendants;
  }

  findParentAwardees(item, all) {
    let ascendant = all.find(a => a.awardee == item.source && a.award_number == item.award_number);
    if (!ascendant) {
      return [];
    }
    let ascendants = [ascendant];
    if (ascendant.source) {
      ascendants.push(...this.findParentAwardees(ascendant, all));
    }
    return ascendants;
  }
}

export {
  GrantsService
};
