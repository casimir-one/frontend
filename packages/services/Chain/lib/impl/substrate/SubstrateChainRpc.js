import BaseChainRpc from './../../base/BaseChainRpc';
import { isAddress, daoIdToAddress } from './utils'

class SubstrateChainRpc extends BaseChainRpc {

  constructor(chainService) {

    const LIST_LIMIT = 1000;
    const toHexFormat = (id) => {
      if (!id) return null;
      const hexId = id.indexOf(`0x`) === 0 ? id : `0x${id}`;
      return hexId;
    }

    const rpc = {

      sendTxAsync: (rawTx) => {
        return chainService.rpcToChainNode('author_submitExtrinsic', [rawTx]);
      },
      

      /* DAO */

      getAccountAsync: (daoId) => {
        return chainService.rpcToChainNode("deipDao_get", [null, toHexFormat(daoId)]);
      },

      getAccountsAsync: (daoIds) => {
        return chainService.rpcToChainNode("deipDao_getMulti", [null, daoIds.map((daoId) => toHexFormat(daoId))]);
      },

      getAccountsListAsync: (startIdx = null, limit = LIST_LIMIT) => {
        return chainService.rpcToChainNode("deipDao_getList", [null, limit, toHexFormat(startIdx)]);
      },



      /* PROJECT */

      getProjectAsync: (projectId) => {
        return chainService.rpcToChainNode("deip_getProject", [null, toHexFormat(projectId)]);
      },

      getProjectsListAsync: (startIdx = null, limit = LIST_LIMIT) => {
        return chainService.rpcToChainNode("deip_getProjectList", [null, limit, toHexFormat(startIdx)]);
      },

      getProjectsByTeamAsync: (daoId, startIdx = null, limit = LIST_LIMIT) => { 
        const chainNodeClient = chainService.getChainNodeClient();
        const teamId = isAddress(daoId) ? daoId : daoIdToAddress(toHexFormat(daoId), chainNodeClient.registry);
        return chainService.rpcToChainNode("deip_getProjectListByTeam", [null, teamId, limit, toHexFormat(startIdx)]);
      },



      /*  PROJECT CONTENT */

      getProjectContentAsync: (projectContentId) => { 
        return chainService.rpcToChainNode("deip_getProjectContent", [null, toHexFormat(projectContentId)]);
      },

      getProjectContentsListAsync: (startIdx = null, limit = LIST_LIMIT) => { 
        return chainService.rpcToChainNode("deip_getProjectContentList", [null, limit, toHexFormat(startIdx)]);
      },

      getProjectContentsByProjectAsync: (projectId, startIdx = null, limit = LIST_LIMIT) => { 
        return chainService.rpcToChainNode("deip_getProjectContentListByProject", [null, toHexFormat(projectId), limit, toHexFormat(startIdx)]);
      },


      /* INVESTMENT OPPORTUNITY */

      getInvestmentOpportunityAsync: (invstOppId) => {
        return chainService.rpcToChainNode("deip_getInvestmentOpportunity", [null, toHexFormat(invstOppId)]);
      },

      getInvestmentOpportunitiesListAsync: (startIdx = null, limit = LIST_LIMIT) => {
        return chainService.rpcToChainNode("deip_getInvestmentOpportunityList", [null, limit, toHexFormat(startIdx)]);
      },


      /* CONTRACT AGREEMENT */

      getContractAgreementAsync: (contractAgreementId) => {
        return chainService.rpcToChainNode("deip_getContractAgreement", [null, toHexFormat(contractAgreementId)]);
      },

      getContractAgreementsListAsync: (startIdx = null, limit = LIST_LIMIT) => {
        return chainService.rpcToChainNode("deip_getContractAgreementList", [null, limit, toHexFormat(startIdx)]);
      },

      getContractAgreementsByTypeAsync: (type, startIdx = null, limit = LIST_LIMIT) => {
        return chainService.rpcToChainNode("deip_getContractAgreementListByType", [null, type, limit, toHexFormat(startIdx)]);
      },


      /* PROPOSAL */

      getProposalAsync: (proposalId) => {
        return chainService.rpcToChainNode("deipProposal_get", [null, toHexFormat(proposalId)]);
      },

      getProposalsListAsync: (startIdx = null, limit = LIST_LIMIT) => {
        return chainService.rpcToChainNode("deipProposal_getList", [null, limit, toHexFormat(startIdx)]);
      },

      getProposalsByCreatorAsync: (daoId, startIdx = null, limit = LIST_LIMIT) => {
        const chainNodeClient = chainService.getChainNodeClient();
        const creator = isAddress(daoId) ? daoId : daoIdToAddress(toHexFormat(daoId), chainNodeClient.registry);
        return chainService.rpcToChainNode("deipProposal_getListByCreator", [null, creator, limit, toHexFormat(startIdx)]);
      },


      /* ASSET */

      getAssetAsync: (id) => {
        return chainService.rpcToChainNode("assets_getAsset", [null, toHexFormat(id)]);
      },

      getAssetsListAsync: (startIdx = null, limit = LIST_LIMIT) => {
        const idx = startIdx ? [toHexFormat(startIdx)[0], toHexFormat(startIdx)[1]] : null;
        return chainService.rpcToChainNode("assets_getAssetList", [null, limit, idx]);
      },
    

      /* ASSET BALANCE */

      getAssetBalanceByOwnerAsync: (daoId, assetId) => {
        const chainNodeClient = chainService.getChainNodeClient();
        const accountId = isAddress(daoId) ? daoId : daoIdToAddress(toHexFormat(daoId), chainNodeClient.registry);
        return chainService.rpcToChainNode("assets_getAssetBalanceByOwner", [null, accountId, toHexFormat(assetId)]);
      },

      getAssetBalancesByAssetAsync: (assetId, startIdx = null, limit = LIST_LIMIT) => {
        return chainService.rpcToChainNode("assets_getAssetBalanceListByAsset", [null, toHexFormat(assetId), limit, toHexFormat(startIdx)]);
      },

      getAssetBalancesListAsync: (startIdx = null, limit = LIST_LIMIT) => {
        const idx = startIdx ? [toHexFormat(startIdx)[0], toHexFormat(startIdx)[1]] : null;
        return chainService.rpcToChainNode("assets_getAssetBalanceList", [null, limit, idx]);
      },



      // TODO:

      setBlockAppliedCallbackAsync: async function (cb) { throw Error(`Not implemented exception`); },
      getStateAsync: async function (path) { throw Error(`Not implemented exception`); },
      getConfigAsync: async function () { throw Error(`Not implemented exception`);},
      getDynamicGlobalPropertiesAsync: async function () { throw Error(`Not implemented exception`); },
      getChainPropertiesAsync: async function () { throw Error(`Not implemented exception`); },
      getWitnessScheduleAsync: async function () { throw Error(`Not implemented exception`); },
      getHardforkVersionAsync: async function () { throw Error(`Not implemented exception`); },
      getNextScheduledHardforkAsync: async function () { throw Error(`Not implemented exception`); },
      getAccountReferencesAsync: async function (accountId) { throw Error(`Not implemented exception`); },
      getAccountCountAsync: async function () { throw Error(`Not implemented exception`); },
      getAccountHistoryAsync: async function (account, from, limit) { throw Error(`Not implemented exception`); },
      getOwnerHistoryAsync: async function (account) { throw Error(`Not implemented exception`); },
      getRecoveryRequestAsync: async function (account) { throw Error(`Not implemented exception`); },
      getWithdrawRoutesAsync: async function (account, withdrawRouteType) { throw Error(`Not implemented exception`); },
      getAccountBandwidthAsync: async function (account, bandwidthType) { throw Error(`Not implemented exception`); },
      getTransactionHexAsync: async function (trx) { throw Error(`Not implemented exception`); },
      getKeyReferencesAsync: async function (keys, fullHistory) { throw Error(`Not implemented exception`); },
      getAccountKeyReferencesAsync: async function (accounts, fullHistory) { throw Error(`Not implemented exception`); },
      getTeamReferencesAsync: async function (teams, fullHistory) { throw Error(`Not implemented exception`); },
      getTeamMemberReferencesAsync: async function (members, fullHistory) { throw Error(`Not implemented exception`); },
      getBlockAsync: async function (blockNum) { throw Error(`Not implemented exception`); },
      getOpsHistoryAsync: async function (from, limit, opt) { throw Error(`Not implemented exception`); },
      getTransactionAsync: async function (trxId) { throw Error(`Not implemented exception`); },
      getBlockHeaderAsync: async function (blockNum) { throw Error(`Not implemented exception`); },
      getOpsInBlockAsync: async function (blockNum, onlyVirtual) { throw Error(`Not implemented exception`); },
      getBlocksHistoryAsync: async function (from, limit) { throw Error(`Not implemented exception`); },
      getAccountDeipToDeipTransfersAsync: async function (account, from, limit) { throw Error(`Not implemented exception`); },
      getRequiredSignaturesAsync: async function (trx, availableKeys) { throw Error(`Not implemented exception`); },
      getPotentialSignaturesAsync: async function (trx) { throw Error(`Not implemented exception`); },
      verifyAuthorityAsync: async function (trx) { throw Error(`Not implemented exception`); },
      getWitnessesAsync: async function (witnessIds) { throw Error(`Not implemented exception`); },
      getWitnessByAccountAsync: async function (accountName) { throw Error(`Not implemented exception`); },
      getWitnessesByVoteAsync: async function (from, limit) { throw Error(`Not implemented exception`); },
      lookupWitnessAccountsAsync: async function (lowerBoundName, limit) { throw Error(`Not implemented exception`); },
      getWitnessCountAsync: async function () { throw Error(`Not implemented exception`); },
      getActiveWitnessesAsync: async function () { throw Error(`Not implemented exception`); },
      getRewardFundAsync: async function (name) { throw Error(`Not implemented exception`); },
      loginAsync: async function (username, password) { throw Error(`Not implemented exception`); },
      getApiByNameAsync: async function (databaseApi) { throw Error(`Not implemented exception`); },
      getVersionAsync: async function () { throw Error(`Not implemented exception`); },
      broadcastTransactionAsync: async function (trx) { throw Error(`Not implemented exception`); },
      broadcastTransactionWithCallbackAsync: async function (confirmationCallback, trx) { throw Error(`Not implemented exception`); },
      broadcastBlockAsync: async function (b) { throw Error(`Not implemented exception`); },
      setMaxBlockAgeAsync: async function (maxBlockAge) { throw Error(`Not implemented exception`); },
      getTeamAsync: async function (account) { throw Error(`Not implemented exception`); },
      lookupTeamsAsync: async function (lowerBound, limit) { throw Error(`Not implemented exception`); },
      getTeamsAsync: async function (ids) { throw Error(`Not implemented exception`); },
      getTeamByPermlinkAsync: async function (permlink) { throw Error(`Not implemented exception`); },
      getReviewVotesByReviewIdAsync: async function (reviewId) { throw Error(`Not implemented exception`); },
      getReviewVotesByReviewAsync: async function (reviewExternalId) { throw Error(`Not implemented exception`); },
      getReviewVotesByVoterAsync: async function (account) { throw Error(`Not implemented exception`); },
      getSchemaAsync: async function () { throw Error(`Not implemented exception`); },
      getExpiringVestingDelegationsAsync: async function (account, from, limit) { throw Error(`Not implemented exception`); },
      lookupDisciplinesAsync: async function (lowerBound, limit) { throw Error(`Not implemented exception`); },
      getDisciplineAsync: async function (externalId) { throw Error(`Not implemented exception`); },
      getDisciplineByNameAsync: async function (name) { throw Error(`Not implemented exception`); },
      getDisciplinesByParentAsync: async function (parentExternalId) { throw Error(`Not implemented exception`); },
      getProjectByPermlinkAsync: async function (teamId, permlink) { throw Error(`Not implemented exception`); },
      getProjectByAbsolutePermlinkAsync: async function (teamPermlink, projectPermlink) { throw Error(`Not implemented exception`); },
      getProjectsAsync: async function (ids) { throw Error(`Not implemented exception`); },
      getProjectLicenseAsync: async function (externalId) { throw Error(`Not implemented exception`); },
      getProjectLicensesAsync: async function (externalIds) { throw Error(`Not implemented exception`); },
      getProjectLicensesByLicenseeAsync: async function (licensee) { throw Error(`Not implemented exception`); },
      getProjectLicensesByLicenserAsync: async function (licenser) { throw Error(`Not implemented exception`); },
      getProjectLicensesByProjectAsync: async function (projectExternalId) { throw Error(`Not implemented exception`); },
      getProjectLicensesByLicenseeAndProjectAsync: async function (licensee, projectExternalId) { throw Error(`Not implemented exception`); },
      getProjectLicensesByLicenseeAndLicenserAsync: async function (licensee, licenser) { throw Error(`Not implemented exception`); },
      getProjectContentByTypeAsync: async function (projectId, type) { throw Error(`Not implemented exception`); },
      getProjectContentByPermlinkAsync: async function (projectId, permlink) { throw Error(`Not implemented exception`); },
      getProjectContentByAbsolutePermlinkAsync: async function (teamPermlink, projectPermlink, researchContentPermlink) { throw Error(`Not implemented exception`); },
      getExpertTokenAsync: async function (id) { throw Error(`Not implemented exception`); },
      getExpertTokensByAccountNameAsync: async function (accountName) { throw Error(`Not implemented exception`); },
      getExpertTokensByDisciplineAsync: async function (disciplineExternalId) { throw Error(`Not implemented exception`); },
      getTeamTokenByAccountAndProjectGroupIdAsync: async function (account, teamId) { throw Error(`Not implemented exception`); },
      getProjectTokenSalesByProjectAsync: async function (projectExternalId) { throw Error(`Not implemented exception`); },
      getProjectTokenSaleContributionsByProjectTokenSaleAsync: async function (tokenSaleExternalId) { throw Error(`Not implemented exception`); },
      getProjectTokenSaleContributionsByContributorAsync: async function (owner) { throw Error(`Not implemented exception`); },
      getDisciplinesByProjectAsync: async function (projectId) { throw Error(`Not implemented exception`); },
      checkTeamExistenceByPermlinkAsync: async function (name) { throw Error(`Not implemented exception`); },
      checkProjectExistenceByPermlinkAsync: async function (teamExternalId, title) { throw Error(`Not implemented exception`); },
      checkProjectContentExistenceByPermlinkAsync: async function (projectExternalId, title) { throw Error(`Not implemented exception`); },
      getExpertiseContributionByProjectContentAndDisciplineAsync: async function (projectContentId, disciplineId) { throw Error(`Not implemented exception`); },
      getExpertiseContributionsByProjectAsync: async function (projectId) { throw Error(`Not implemented exception`); },
      getExpertiseContributionsByProjectAndDisciplineAsync: async function (projectId, disciplineId) { throw Error(`Not implemented exception`); },
      getExpertiseContributionsByProjectContentAsync: async function (projectContentId) { throw Error(`Not implemented exception`); },
      lookupWitnessAccountsAsync: async function (lowerBoundName, limit) { throw Error(`Not implemented exception`); },
      getWitnessByAccountAsync: async function (accountName) { throw Error(`Not implemented exception`); },
      getReviewAsync: async function (externalId) { throw Error(`Not implemented exception`); },
      getReviewsAsync: async function (ids) { throw Error(`Not implemented exception`); },
      getReviewsByProjectContentAsync: async function (projectContentExternalId) { throw Error(`Not implemented exception`); },
      getReviewsByProjectAsync: async function (projectExternalId) { throw Error(`Not implemented exception`); },
      getProjectTokensByAccountNameAsync: async function (accountName) { throw Error(`Not implemented exception`); },
      getProjectTokensByProjectIdAsync: async function (projectId) { throw Error(`Not implemented exception`); },
      getProjectTokenByAccountNameAndProjectIdAsync: async function (accountName, projectId) { throw Error(`Not implemented exception`); },
      getExpertiseAllocationProposalByIdAsync: async function (id) { throw Error(`Not implemented exception`); },
      getExpertiseAllocationProposalsByInitiatorAsync: async function (initiator) { throw Error(`Not implemented exception`); },
      getExpertiseAllocationProposalsByClaimerAndDisciplineAsync: async function (claimer, disciplineId) { throw Error(`Not implemented exception`); },
      getExpertiseAllocationProposalByDisciplineInitiatorAndClaimerAsync: async function (disciplineId, initiator, claimer) { throw Error(`Not implemented exception`); },
      getExpertiseAllocationProposalsByDisciplineAsync: async function (disciplineId) { throw Error(`Not implemented exception`); },
      getExpertiseAllocationProposalVoteByIdAsync: async function (id) { throw Error(`Not implemented exception`); },
      getExpertiseAllocationProposalVotesByExpertiseAllocationProposalIdAsync: async function (expertiseAllocationProposalId) { throw Error(`Not implemented exception`); },
      getExpertiseAllocationProposalVoteByVoterAndExpertiseAllocationProposalIdAsync: async function (voter, expertiseAllocationProposalId) { throw Error(`Not implemented exception`); },
      getExpertiseAllocationProposalVotesByVoterAndDisciplineIdAsync: async function (voter, disciplineId) { throw Error(`Not implemented exception`); },
      getExpertiseAllocationProposalVotesByVoterAsync: async function (voter) { throw Error(`Not implemented exception`); },
      getAccountsByExpertDisciplineAsync: async function (disciplineId, from, limit) { throw Error(`Not implemented exception`); },
      getReviewsByAuthorAsync: async function (author) { throw Error(`Not implemented exception`); },
      getFundingOpportunityAnnouncementAsync: async function (id) { throw Error(`Not implemented exception`); },
      getFundingOpportunityAnnouncementByNumberAsync: async function (number) { throw Error(`Not implemented exception`); },
      getFundingOpportunityAnnouncementsByOrganizationAsync: async function (teamId) { throw Error(`Not implemented exception`); },
      getFundingOpportunityAnnouncementsListingAsync: async function (page, limit) { throw Error(`Not implemented exception`); },
      getGrantWithAnnouncedApplicationWindowAsync: async function (id) { throw Error(`Not implemented exception`); },
      getGrantsWithAnnouncedApplicationWindowByGrantorAsync: async function (grantor) { throw Error(`Not implemented exception`); },
      getGrantApplicationAsync: async function (id) { throw Error(`Not implemented exception`); },
      getGrantApplicationsByGrantAsync: async function (grantId) { throw Error(`Not implemented exception`); },
      getGrantApplicationsByProjectIdAsync: async function (projectId) { throw Error(`Not implemented exception`); },
      getGrantApplicationReviewAsync: async function (id) { throw Error(`Not implemented exception`); },
      getGrantApplicationReviewsByAuthorAsync: async function (author) { throw Error(`Not implemented exception`); },
      getGrantApplicationReviewByAuthorAndApplicationAsync: async function (author, grantApplicaitonId) { throw Error(`Not implemented exception`); },
      getGrantApplicationReviewsByGrantApplicationAsync: async function (grantApplicationId) { throw Error(`Not implemented exception`); },
      getAwardAsync: async function (awardNumber) { throw Error(`Not implemented exception`); },
      getAwardsByFundingOpportunityAsync: async function (fundingOpportunityNumber) { throw Error(`Not implemented exception`); },
      getAwardRecipientAsync: async function (id) { throw Error(`Not implemented exception`); },
      getAwardRecipientsByAwardAsync: async function (awardNumber) { throw Error(`Not implemented exception`); },
      getAwardRecipientsByAccountAsync: async function (awardee) { throw Error(`Not implemented exception`); },
      getAwardRecipientsByFundingOpportunityAsync: async function (number) { throw Error(`Not implemented exception`); },
      getAwardWithdrawalRequestAsync: async function (awardNumber, paymentNumber) { throw Error(`Not implemented exception`); },
      getAwardWithdrawalRequestsByAwardAsync: async function (awardNumber) { throw Error(`Not implemented exception`); },
      getAwardWithdrawalRequestsByAwardAndSubawardAsync: async function (awardNumber, subawardNumber) { throw Error(`Not implemented exception`); },
      getAwardWithdrawalRequestsByAwardAndStatusAsync: async function (awardNumber, status) { throw Error(`Not implemented exception`); },
      getWithdrawalRequestsHistoryByAwardNumberAsync: async function (awardNumber) { throw Error(`Not implemented exception`); },
      getWithdrawalRequestHistoryByAwardAndPaymentNumberAsync: async function (awardNumber, paymentNumber) { throw Error(`Not implemented exception`); },
      getWithdrawalRequestsHistoryByAwardAndSubawardNumberAsync: async function (awardNumber, subawardNumber) { throw Error(`Not implemented exception`); },
      getAssetBySymbolAsync: async function (symbol) { throw Error(`Not implemented exception`); },
      getAssetsByIssuerAsync: async function (issuer) { throw Error(`Not implemented exception`); },
      getAssetsByTypeAsync: async function (type) { throw Error(`Not implemented exception`); },
      getFundingTransactionAsync: async function (id) { throw Error(`Not implemented exception`); },
      getFundingTransactionsBySenderOrganisationAsync: async function (senderOrganisationId) { throw Error(`Not implemented exception`); },
      getFundingTransactionsByReceiverOrganisationAsync: async function (receiverOrganisationId) { throw Error(`Not implemented exception`); },
      getAssetStatisticsAsync: async function (symbol) { throw Error(`Not implemented exception`); },
      getAccountAssetsBalancesAsync: async function (owner) { throw Error(`Not implemented exception`); },
      getProjectNdaAsync: async function (externalId) { throw Error(`Not implemented exception`); },
      getProjectNdaByCreatorAsync: async function (creator) { throw Error(`Not implemented exception`); },
      getProjectNdaByHashAsync: async function (hash) { throw Error(`Not implemented exception`); },
      getProjectNdaByProjectAsync: async function (externalId) { throw Error(`Not implemented exception`); },
      getNdaContractContentAccessRequestAsync: async function (externalId) { throw Error(`Not implemented exception`); },
      getNdaContractContentAccessRequestsByNdaAsync: async function (ndaExternalId) { throw Error(`Not implemented exception`); },
      getNdaContractContentAccessRequestsByRequesterAsync: async function (requester) { throw Error(`Not implemented exception`); },
      getNdaContractRequestAsync: async function (id) { throw Error(`Not implemented exception`); },
      getNdaContractRequestsByContractIdAsync: async function (contractId) { throw Error(`Not implemented exception`); },
      getNdaContractRequestsByRequesterAsync: async function (requester) { throw Error(`Not implemented exception`); },
      getNdaContractRequestByContractIdAndHashAsync: async function (contractId, encryptedPayloadHash) { throw Error(`Not implemented exception`); },
      getSubscriptionAsync: async function (id) { throw Error(`Not implemented exception`); },
      getSubscriptionByTeamIdAsync: async function (teamId) { throw Error(`Not implemented exception`); },
      getSubscriptionsByOwnerAsync: async function (owner) { throw Error(`Not implemented exception`); },
      getOrganisationHistoryAsync: async function (organisationId) { throw Error(`Not implemented exception`); },
      getContentHistoryByHashAsync: async function (contentHash) { throw Error(`Not implemented exception`); },
      getContentHistoryByProjectAndHashAsync: async function (projectId, contentHash) { throw Error(`Not implemented exception`); },
      getContributionsHistoryByContributorAsync: async function (investor) { throw Error(`Not implemented exception`); },
      getContributionsHistoryByContributorAndProjectAsync: async function (investor, projectId) { throw Error(`Not implemented exception`); },
      getContributionsHistoryByProjectAsync: async function (projectId) { throw Error(`Not implemented exception`); },
      getContributionsHistoryByTokenSaleAsync: async function (projectTokenSaleId) { throw Error(`Not implemented exception`); },
      getContentReferencesAsync: async function (projectContentId) { throw Error(`Not implemented exception`); },
      getContentReferences2Async: async function (projectContentExternalId) { throw Error(`Not implemented exception`); },
      getContentsReferToContentAsync: async function (projectContentId) { throw Error(`Not implemented exception`); },
      getContentsReferToContent2Async: async function (projectContentExternalId) { throw Error(`Not implemented exception`); },
      getProjectContentEciHistoryAsync: async function (projectContentExternalId, cursor, disciplineFilter, fromFilter, toFilter, contributionTypeFilter, assessmentCriteriaTypeFilter) { throw Error(`Not implemented exception`); },
      getProjectContentEciStatsAsync: async function (projectContentExternalId, disciplineFilter, fromFilter, toFilter, contributionTypeFilter, assessmentCriteriaTypeFilter) { throw Error(`Not implemented exception`); },
      getProjectContentsEciStatsAsync: async function (disciplineFilter, fromFilter, toFilter, contributionTypeFilter, assessmentCriteriaTypeFilter) { throw Error(`Not implemented exception`); },
      getProjectEciHistoryAsync: async function (projectExternalId, cursor, disciplineFilter, fromFilter, toFilter, contributionTypeFilter, assessmentCriteriaTypeFilter) { throw Error(`Not implemented exception`); },
      getProjectEciStatsAsync: async function (projectExternalId, disciplineFilter, fromFilter, toFilter, contributionTypeFilter, assessmentCriteriaTypeFilter) { throw Error(`Not implemented exception`); },
      getProjectsEciStatsAsync: async function (disciplineFilter, fromFilter, toFilter, contributionTypeFilter, assessmentCriteriaTypeFilter) { throw Error(`Not implemented exception`); },
      getAccountEciHistoryAsync: async function (account, cursor, disciplineFilter, fromFilter, toFilter, contributionTypeFilter, assessmentCriteriaTypeFilter) { throw Error(`Not implemented exception`); },
      getAccountEciStatsAsync: async function (account, disciplineFilter, fromFilter, toFilter, contributionTypeFilter, assessmentCriteriaTypeFilter) { throw Error(`Not implemented exception`); },
      getAccountsEciStatsAsync: async function (disciplineFilter, fromFilter, toFilter, contributionTypeFilter, assessmentCriteriaTypeFilter) { throw Error(`Not implemented exception`); },
      getDisciplinesEciStatsHistoryAsync: async function (fromFilter, toFilter, stepFilter) { throw Error(`Not implemented exception`); },
      getDisciplineEciHistoryAsync: async function (disciplineFilter, fromFilter, toFilter, contributionTypeFilter, assessmentCriteriaTypeFilter) { throw Error(`Not implemented exception`); },
      getDisciplinesEciLastStatsAsync: async function () { throw Error(`Not implemented exception`); },
      getAccountRevenueHistoryBySecurityTokenAsync: async function (account, securityTokenExternalId, cursor, step, targetAssetSymbol) { throw Error(`Not implemented exception`); },
      getAccountRevenueHistoryAsync: async function (account, cursor) { throw Error(`Not implemented exception`); },
      getSecurityTokenRevenueHistoryAsync: async function (securityTokenExternalId, cursor) { throw Error(`Not implemented exception`); },
      getProposalsBySignerAsync: async function (account) { throw Error(`Not implemented exception`); },
      getProposalsBySignersAsync: async function (accounts) { throw Error(`Not implemented exception`); },
      getProposalStateAsync: async function (externalId) { throw Error(`Not implemented exception`); },
      getProposalsStatesAsync: async function (externalIds) { throw Error(`Not implemented exception`); },
      lookupProposalsStatesAsync: async function (lowerBound, limit) { throw Error(`Not implemented exception`); },
      getContractAgreementsByCreatorAsync: (creator) => { throw Error(`Not implemented exception`); },
      getProjectContentsAsync: (ids) => { throw Error(`Not implemented exception`); },
    }
    return super(rpc);
  }
}


export default SubstrateChainRpc;