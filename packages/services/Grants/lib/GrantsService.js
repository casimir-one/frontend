import { Singleton } from '@deip/toolbox';
import { GrantsHttp } from './GrantsHttp';
import { BlockchainService } from '@deip/blockchain-service';
import deipRpc from '@deip/rpc-client';

class GrantsService extends Singleton {
  grantsHttp = GrantsHttp.getInstance();
  blockchainService = BlockchainService.getInstance();


  createGrantContract(privKey, {
    foaNumber,
    grantor,
    amount,
    targetDisciplines,
    distributionModel,
    extensions
  }) {

    return this.blockchainService.getRefBlockSummary()
      .then((refBlock) => {

        const create_grant_op = ['create_grant', {
          "external_id": foaNumber, // replace with entitiy id
          "grantor": grantor,
          "amount": amount,
          "target_disciplines": targetDisciplines,
          "distribution_model": distributionModel,
          "extensions": extensions
        }];

        return this.blockchainService.signOperations([create_grant_op], privKey)
          .then((signedTx) => {
            return this.blockchainService.sendTransactionAsync(signedTx)
          })
      })
  }
 

  createFundingOpportunityAward(privKey, {
    awardNumber,
    fundingOpportunityNumber,
    award,
    awardee,
    researchExternalId,
    universityExternalId,
    universityOverhead,
    subawardees,
    creator,
    extensions
  }) {

    return this.blockchainService.getRefBlockSummary()
      .then((refBlock) => {

        const create_award_op = ['create_award', {
          award_number: awardNumber,
          funding_opportunity_number: fundingOpportunityNumber,
          award: award,
          awardee: awardee,
          research_external_id: researchExternalId,
          university_external_id: universityExternalId,
          university_overhead: universityOverhead,
          subawardees: subawardees,
          creator: creator,
          extensions: extensions
        }];

        return this.blockchainService.signOperations([create_award_op], privKey)
          .then((signedTx) => {
            return this.blockchainService.sendTransactionAsync(signedTx)
          })
      })
  }

  approveFundingOpportunityAward(privKey, {
    awardNumber,
    approver,
    extensions
  }) {
    return deipRpc.broadcast.approveAwardAsync(
      privKey,
      awardNumber,
      approver,
      extensions);
  }

  rejectFundingOpportunityAward(privKey, {
    awardNumber,
    rejector,
    extensions
  }) {
    return deipRpc.broadcast.rejectAwardAsync(
      privKey,
      awardNumber,
      rejector,
      extensions);
  }

  createAwardWithdrawalRequest({ privKey, username }, form) {
    return this.grantsHttp.createGrantAwardWithdrawalRequest(form.get('researchExternalId'), form)
      .then((res) => {
        const { hash } = res;
        return deipRpc.broadcast.createAwardWithdrawalRequestAsync(
          privKey,
          form.get('paymentNumber'),
          form.get('awardNumber'),
          form.get('subawardNumber'),
          form.get('requester'),
          form.get('amount'),
          form.get('description'),
          hash,
          []
        );
      })
  }


  authorizeAwardWithdrawalRequest(privKey, {
    paymentNumber,
    awardNumber,
    subawardNumber,
    account,
    extensions
  }) {

    const certify_award_withdrawal_request_op = ["certify_award_withdrawal_request", {
      "payment_number": paymentNumber,
      "award_number": awardNumber,
      "subaward_number": subawardNumber,
      "certifier": account,
      "extensions": extensions || []
    }];

    const approve_award_withdrawal_request_op = ["approve_award_withdrawal_request", {
      "payment_number": paymentNumber,
      "award_number": awardNumber,
      "subaward_number": subawardNumber,
      "approver": account,
      "extensions": extensions || []
    }];

    const pay_award_withdrawal_request_op = ["pay_award_withdrawal_request", {
      "payment_number": paymentNumber,
      "award_number": awardNumber,
      "subaward_number": subawardNumber,
      "payer": account,
      "extensions": extensions || []
    }];

    return this.blockchainService.signOperations([
      certify_award_withdrawal_request_op, 
      approve_award_withdrawal_request_op, 
      pay_award_withdrawal_request_op
    ], privKey)
      .then((signedTx) => {
        return this.blockchainService.sendTransactionAsync(signedTx)
      })
  }

  certifyAwardWithdrawalRequest(privKey, {
    paymentNumber,
    awardNumber,
    subawardNumber,
    certifier,
    extensions
  }) {
    return deipRpc.broadcast.certifyAwardWithdrawalRequestAsync(
      privKey,
      paymentNumber,
      awardNumber,
      subawardNumber,
      certifier,
      extensions);
  }

  approveAwardWithdrawalRequest(privKey, {
    paymentNumber,
    awardNumber,
    subawardNumber,
    approver,
    extensions
  }) {
    return deipRpc.broadcast.approveAwardWithdrawalRequestAsync(
      privKey,
      paymentNumber,
      awardNumber,
      subawardNumber,
      approver,
      extensions);
  }

  rejectAwardWithdrawalRequest(privKey, {
    paymentNumber,
    awardNumber,
    subawardNumber,
    rejector,
    extensions
  }) {
    return deipRpc.broadcast.rejectAwardWithdrawalRequestAsync(
      privKey,
      paymentNumber,
      awardNumber,
      subawardNumber,
      rejector,
      extensions);
  }

  payAwardWithdrawalRequest(privKey, {
    paymentNumber,
    awardNumber,
    subawardNumber,
    payer,
    extensions
  }) {
    return deipRpc.broadcast.payAwardWithdrawalRequestAsync(
      privKey,
      paymentNumber,
      awardNumber,
      subawardNumber,
      payer,
      extensions);
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
