import BaseChainRpc from './../../base/BaseChainRpc';


class GrapheneChainRpc extends BaseChainRpc {

  constructor(chainService) {

    const LIST_LIMIT = 1000;

    const api = {
      sendTxAsync: (rawTx) => {
        return chainService.rpcToChainNode("call", ["network_broadcast_api", "broadcast_transaction_synchronous", [rawTx]]);
      },
      
      getProjectAsync: (projectId) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_research", [projectId]]);
      },

      getProjectsListAsync: (startIdx = 0, limit = LIST_LIMIT) => {
        return chainService.rpcToChainNode("call", ["database_api", "lookup_researches", [startIdx, limit]]);
      },

      setBlockAppliedCallbackAsync: (cb) => {
        return chainService.rpcToChainNode("call", ["database_api", "set_block_applied_callback", [cb]]);
      },

      getStateAsync: (path) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_state", [path]]);
      },

      getConfigAsync: () => {
        return chainService.rpcToChainNode("call", ["database_api", "get_config"]);
      },

      getDynamicGlobalPropertiesAsync: () => {
        return chainService.rpcToChainNode("call", ["database_api", "get_dynamic_global_properties"]);
      },

      getChainPropertiesAsync: () => {
        return chainService.rpcToChainNode("call", ["database_api", "get_chain_properties"]);
      },

      getWitnessScheduleAsync: () => {
        return chainService.rpcToChainNode("call", ["database_api", "get_witness_schedule"]);
      },

      getHardforkVersionAsync: () => {
        return chainService.rpcToChainNode("call", ["database_api", "get_hardfork_version"]);
      },
      getNextScheduledHardforkAsync: () => {
        return chainService.rpcToChainNode("call", ["database_api", "get_next_scheduled_hardfork"]);
      },
      getAccountsAsync: (daoIds) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_accounts", [daoIds]]);
      },
      getAccountReferencesAsync: (accountId) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_account_references", [accountId]])
      },
      getAccountsListAsync: (startIdx = 0, limit = LIST_LIMIT) => {
        return chainService.rpcToChainNode("call", ["database_api", "lookup_accounts", [startIdx, limit]])
      },
      getAccountCountAsync: () => {
        return chainService.rpcToChainNode("call", ["database_api", "get_account_count", []])
      },
      getAccountHistoryAsync: (account, from, limit) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_account_history", [account, from, limit]])
      },
      getOwnerHistoryAsync: (account) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_owner_history", [account]])
      },
      getRecoveryRequestAsync: (account) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_recovery_request", [account]])
      },
      getWithdrawRoutesAsync: (account, withdrawRouteType) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_withdraw_routes", [account, withdrawRouteType]])
      },
      getAccountBandwidthAsync: (account, bandwidthType) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_account_bandwidth", [account, bandwidthType]])
      },
      getTransactionHexAsync: (trx) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_transaction_hex", [trx]])
      },
      getKeyReferencesAsync: (keys, fullHistory) => {
        return chainService.rpcToChainNode("call", ["account_by_key_api", "get_key_references", [keys, fullHistory]])
      },
      getAccountKeyReferencesAsync: (accounts, fullHistory) => {
        return chainService.rpcToChainNode("call", ["account_by_key_api", "get_account_key_references", [accounts, fullHistory]])
      },
      getTeamReferencesAsync: (teams, fullHistory) => {
        return chainService.rpcToChainNode("call", ["account_by_key_api", "get_team_references", [teams, fullHistory]])
      },
      getTeamMemberReferencesAsync: (members, fullHistory) => {
        return chainService.rpcToChainNode("call", ["account_by_key_api", "get_team_member_references", [members, fullHistory]])
      },
      getBlockAsync: (blockNum) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_block", [blockNum]])
      },
      getOpsHistoryAsync: (from, limit, opt) => {
        return chainService.rpcToChainNode("call", ["blockchain_history_api", "get_ops_history", [from, limit, opt]])
      },
      getTransactionAsync: (trxId) => {
        return chainService.rpcToChainNode("call", ["blockchain_history_api", "get_transaction", [trxId]])
      },
      getBlockHeaderAsync: (blockNum) => {
        return chainService.rpcToChainNode("call", ["blockchain_history_api", "get_block_header", [blockNum]])
      },
      getOpsInBlockAsync: (blockNum, onlyVirtual) => {
        return chainService.rpcToChainNode("call", ["blockchain_history_api", "get_ops_in_block", [blockNum, onlyVirtual]])
      },
      getBlocksHistoryAsync: (from, limit) => {
        return chainService.rpcToChainNode("call", ["blockchain_history_api", "get_blocks_history", [from, limit]])
      },
      getAccountDeipToDeipTransfersAsync: (account, from, limit) => {
        return chainService.rpcToChainNode("call", ["account_history_api", "get_account_deip_to_deip_transfers", [account, from, limit]])
      },
      getRequiredSignaturesAsync: (trx, availableKeys) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_required_signatures", [trx, availableKeys]])
      },
      getPotentialSignaturesAsync: (trx) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_potential_signatures", [trx]])
      },
      verifyAuthorityAsync: (trx) => {
        return chainService.rpcToChainNode("call", ["database_api", "verify_authority", [trx]])
      },
      getWitnessesAsync: (witnessIds) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_witnesses", [witnessIds]])
      },
      getWitnessByAccountAsync: (accountName) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_witness_by_account", [accountName]])
      },
      getWitnessesByVoteAsync: (from, limit) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_witnesses_by_vote", [from, limit]])
      },
      lookupWitnessAccountsAsync: (lowerBoundName, limit) => {
        return chainService.rpcToChainNode("call", ["database_api", "lookup_witness_accounts", [lowerBoundName, limit]])
      },
      getWitnessCountAsync: () => {
        return chainService.rpcToChainNode("call", ["database_api", "get_witness_count", []])
      },
      getActiveWitnessesAsync: () => {
        return chainService.rpcToChainNode("call", ["database_api", "get_active_witnesses", []])
      },
      getRewardFundAsync: (name) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_reward_fund", [name]])
      },
      loginAsync: (username, password) => {
        return chainService.rpcToChainNode("call", ["login_api", "login", [username, password]])
      },
      getApiByNameAsync: (databaseApi) => {
        return chainService.rpcToChainNode("call", ["login_api", "get_api_by_name", [databaseApi]])
      },
      getVersionAsync: () => {
        return chainService.rpcToChainNode("call", ["login_api", "get_version", []])
      },
      broadcastTransactionAsync: (trx) => {
        return chainService.rpcToChainNode("call", ["network_broadcast_api", "broadcast_transaction", [trx]])
      },
      broadcastTransactionWithCallbackAsync: (confirmationCallback, trx) => {
        return chainService.rpcToChainNode("call", ["network_broadcast_api", "broadcast_transaction_with_callback", [confirmationCallback, trx]])
      },
      broadcastBlockAsync: (b) => {
        return chainService.rpcToChainNode("call", ["network_broadcast_api", "broadcast_block", [b]])
      },
      setMaxBlockAgeAsync: (maxBlockAge) => {
        return chainService.rpcToChainNode("call", ["network_broadcast_api", "set_max_block_age", [maxBlockAge]])
      },
      getTeamAsync: (account) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_research_group", [account]])
      },
      lookupTeamsAsync: (lowerBound, limit) => {
        return chainService.rpcToChainNode("call", ["database_api", "lookup_research_groups", [lowerBound, limit]])
      },
      getTeamsAsync: (ids) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_research_groups", [ids]])
      },
      getTeamByPermlinkAsync: (permlink) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_research_group_by_permlink", [permlink]])
      },
      getReviewVotesByReviewIdAsync: (reviewId) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_review_votes_by_review_id", [reviewId]])
      },
      getReviewVotesByReviewAsync: (reviewExternalId) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_review_votes_by_review", [reviewExternalId]])
      },
      getReviewVotesByVoterAsync: (account) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_review_votes_by_voter", [account]])
      },
      getProjectsByTeamAsync: (teamId, startIdx = 0, limit = LIST_LIMIT) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_researches_by_research_group", [teamId]])
      },
      getSchemaAsync: () => {
        return chainService.rpcToChainNode("call", ["database_api", "get_schema", []])
      },
      getExpiringVestingDelegationsAsync: (account, from, limit) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_expiring_vesting_delegations", [account, from, limit]])
      },
      lookupDisciplinesAsync: (lowerBound, limit) => {
        return chainService.rpcToChainNode("call", ["database_api", "lookup_disciplines", [lowerBound, limit]])
      },
      getDisciplineAsync: (externalId) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_discipline", [externalId]])
      },
      getDisciplineByNameAsync: (name) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_discipline_by_name", [name]])
      },
      getDisciplinesByParentAsync: (parentExternalId) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_disciplines_by_parent", [parentExternalId]])
      },
      getProjectByPermlinkAsync: (teamId, permlink) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_research_by_permlink", [teamId, permlink]])
      },
      getProjectByAbsolutePermlinkAsync: (teamPermlink, projectPermlink) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_research_by_absolute_permlink", [teamPermlink, projectPermlink]])
      },
      getProjectsAsync: (ids) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_researches", [ids]])
      },
      getProjectContentsByProjectAsync: (projectId, startIdx = 0, limit = LIST_LIMIT) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_research_contents_by_research", [projectId]])
      },
      getProjectLicenseAsync: (externalId) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_research_license", [externalId]])
      },
      getProjectLicensesAsync: (externalIds) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_research_licenses", [externalIds]])
      },
      getProjectLicensesByLicenseeAsync: (licensee) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_research_licenses_by_licensee", [licensee]])
      },
      getProjectLicensesByLicenserAsync: (licenser) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_research_licenses_by_licenser", [licenser]])
      },
      getProjectLicensesByProjectAsync: (projectExternalId) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_research_licenses_by_research", [projectExternalId]])
      },
      getProjectLicensesByLicenseeAndProjectAsync: (licensee, projectExternalId) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_research_licenses_by_licensee_and_research", [licensee, projectExternalId]])
      },
      getProjectLicensesByLicenseeAndLicenserAsync: (licensee, licenser) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_research_licenses_by_licensee_and_licenser", [licensee, licenser]])
      },
      getProjectContentAsync: (projectContentId) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_research_content", [projectContentId]])
      },
      getProjectContentsAsync: (ids) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_research_contents", [ids]])
      },
      getProjectContentByTypeAsync: (projectId, type) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_research_content_by_type", [projectId, type]])
      },
      getProjectContentByPermlinkAsync: (projectId, permlink) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_research_content_by_permlink", [projectId, permlink]])
      },
      getProjectContentByAbsolutePermlinkAsync: (teamPermlink, projectPermlink, researchContentPermlink) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_research_content_by_absolute_permlink", [teamPermlink, projectPermlink, researchContentPermlink]])
      },
      getExpertTokenAsync: (id) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_expert_token", [id]])
      },
      getExpertTokensByAccountNameAsync: (accountName) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_expert_tokens_by_account_name", [accountName]])
      },
      getExpertTokensByDisciplineAsync: (disciplineExternalId) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_expert_tokens_by_discipline", [disciplineExternalId]])
      },
      getProposalAsync: (id) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_proposal", [id]])
      },
      getProposalsListAsync: (startIdx = 0, limit = LIST_LIMIT) => {
        throw new Error("Not implemented exception");
      },
      getProposalsByCreatorAsync: (creator, startIdx = 0, limit = LIST_LIMIT) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_proposals_by_creator", [creator]])
      },
      getTeamTokenByAccountAndProjectGroupIdAsync: (account, teamId) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_research_group_token_by_account_and_research_group_id", [account, teamId]])
      },
      getInvestmentOpportunityAsync: (invstOppId) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_research_token_sale", [invstOppId]])
      },
      getProjectTokenSalesByProjectAsync: (projectExternalId) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_research_token_sales_by_research", [projectExternalId]])
      },
      getInvestmentOpportunitiesListAsync: (startIdx = 0, limit = LIST_LIMIT) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_research_token_sales", [startIdx, limit]])
      },
      getProjectTokenSaleContributionsByProjectTokenSaleAsync: (tokenSaleExternalId) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_research_token_sale_contributions_by_research_token_sale", [tokenSaleExternalId]])
      },
      getProjectTokenSaleContributionsByContributorAsync: (owner) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_research_token_sale_contributions_by_contributor", [owner]])
      },
      getDisciplinesByProjectAsync: (projectId) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_disciplines_by_research", [projectId]])
      },
      checkTeamExistenceByPermlinkAsync: (name) => {
        return chainService.rpcToChainNode("call", ["database_api", "check_research_group_existence_by_permlink", [name]])
      },
      checkProjectExistenceByPermlinkAsync: (teamExternalId, title) => {
        return chainService.rpcToChainNode("call", ["database_api", "check_research_existence_by_permlink", [teamExternalId, title]])
      },
      checkProjectContentExistenceByPermlinkAsync: (projectExternalId, title) => {
        return chainService.rpcToChainNode("call", ["database_api", "check_research_content_existence_by_permlink", [projectExternalId, title]])
      },
      getExpertiseContributionByProjectContentAndDisciplineAsync: (projectContentId, disciplineId) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_expertise_contribution_by_research_content_and_discipline", [projectContentId, disciplineId]])
      },
      getExpertiseContributionsByProjectAsync: (projectId) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_expertise_contributions_by_research", [projectId]])
      },
      getExpertiseContributionsByProjectAndDisciplineAsync: (projectId, disciplineId) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_expertise_contributions_by_research_and_discipline", [projectId, disciplineId]])
      },
      getExpertiseContributionsByProjectContentAsync: (projectContentId) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_expertise_contributions_by_research_content", [projectContentId]])
      },
      lookupWitnessAccountsAsync: (lowerBoundName, limit) => {
        return chainService.rpcToChainNode("call", ["database_api", "lookup_witness_accounts", [lowerBoundName, limit]])
      },
      getWitnessByAccountAsync: (accountName) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_witness_by_account", [accountName]])
      },
      getReviewAsync: (externalId) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_review", [externalId]])
      },
      getReviewsAsync: (ids) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_reviews", [ids]])
      },
      getReviewsByProjectContentAsync: (projectContentExternalId) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_reviews_by_research_content", [projectContentExternalId]])
      },
      getReviewsByProjectAsync: (projectExternalId) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_reviews_by_research", [projectExternalId]])
      },
      getProjectTokensByAccountNameAsync: (accountName) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_research_tokens_by_account_name", [accountName]])
      },
      getProjectTokensByProjectIdAsync: (projectId) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_research_tokens_by_research_id", [projectId]])
      },
      getProjectTokenByAccountNameAndProjectIdAsync: (accountName, projectId) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_research_token_by_account_name_and_research_id", [accountName, projectId]])
      },
      getExpertiseAllocationProposalByIdAsync: (id) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_expertise_allocation_proposal_by_id", [id]])
      },
      getExpertiseAllocationProposalsByInitiatorAsync: (initiator) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_expertise_allocation_proposals_by_initiator", [initiator]])
      },
      getExpertiseAllocationProposalsByClaimerAndDisciplineAsync: (claimer, disciplineId) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_expertise_allocation_proposals_by_claimer_and_discipline", [claimer, disciplineId]])
      },
      getExpertiseAllocationProposalByDisciplineInitiatorAndClaimerAsync: (disciplineId, initiator, claimer) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_expertise_allocation_proposal_by_discipline_initiator_and_claimer", [disciplineId, initiator, claimer]])
      },
      getExpertiseAllocationProposalsByDisciplineAsync: (disciplineId) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_expertise_allocation_proposals_by_discipline", [disciplineId]])
      },
      getExpertiseAllocationProposalVoteByIdAsync: (id) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_expertise_allocation_proposal_vote_by_id", [id]])
      },
      getExpertiseAllocationProposalVotesByExpertiseAllocationProposalIdAsync: (expertiseAllocationProposalId) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_expertise_allocation_proposal_votes_by_expertise_allocation_proposal_id", [expertiseAllocationProposalId]])
      },
      getExpertiseAllocationProposalVoteByVoterAndExpertiseAllocationProposalIdAsync: (voter, expertiseAllocationProposalId) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_expertise_allocation_proposal_vote_by_voter_and_expertise_allocation_proposal_id", [voter, expertiseAllocationProposalId]])
      },
      getExpertiseAllocationProposalVotesByVoterAndDisciplineIdAsync: (voter, disciplineId) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_expertise_allocation_proposal_votes_by_voter_and_discipline_id", [voter, disciplineId]])
      },
      getExpertiseAllocationProposalVotesByVoterAsync: (voter) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_expertise_allocation_proposal_votes_by_voter", [voter]])
      },
      getAccountsByExpertDisciplineAsync: (disciplineId, from, limit) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_accounts_by_expert_discipline", [disciplineId, from, limit]])
      },
      getReviewsByAuthorAsync: (author) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_reviews_by_author", [author]])
      },
      getFundingOpportunityAnnouncementAsync: (id) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_funding_opportunity_announcement", [id]])
      },
      getFundingOpportunityAnnouncementByNumberAsync: (number) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_funding_opportunity_announcement_by_number", [number]])
      },
      getFundingOpportunityAnnouncementsByOrganizationAsync: (teamId) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_funding_opportunity_announcements_by_organization", [teamId]])
      },
      getFundingOpportunityAnnouncementsListingAsync: (page, limit) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_funding_opportunity_announcements_listing", [page, limit]])
      },
      getGrantWithAnnouncedApplicationWindowAsync: (id) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_grant_with_announced_application_window", [id]])
      },
      getGrantsWithAnnouncedApplicationWindowByGrantorAsync: (grantor) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_grants_with_announced_application_window_by_grantor", [grantor]])
      },
      getGrantApplicationAsync: (id) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_grant_application", [id]])
      },
      getGrantApplicationsByGrantAsync: (grantId) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_grant_applications_by_grant", [grantId]])
      },
      getGrantApplicationsByProjectIdAsync: (projectId) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_grant_applications_by_research_id", [projectId]])
      },
      getGrantApplicationReviewAsync: (id) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_grant_application_review", [id]])
      },
      getGrantApplicationReviewsByAuthorAsync: (author) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_grant_application_reviews_by_author", [author]])
      },
      getGrantApplicationReviewByAuthorAndApplicationAsync: (author, grantApplicaitonId) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_grant_application_review_by_author_and_application", [author, grantApplicaitonId]])
      },
      getGrantApplicationReviewsByGrantApplicationAsync: (grantApplicationId) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_grant_application_reviews_by_grant_application", [grantApplicationId]])
      },
      getAwardAsync: (awardNumber) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_award", [awardNumber]])
      },
      getAwardsByFundingOpportunityAsync: (fundingOpportunityNumber) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_awards_by_funding_opportunity", [fundingOpportunityNumber]])
      },
      getAwardRecipientAsync: (id) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_award_recipient", [id]])
      },
      getAwardRecipientsByAwardAsync: (awardNumber) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_award_recipients_by_award", [awardNumber]])
      },
      getAwardRecipientsByAccountAsync: (awardee) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_award_recipients_by_account", [awardee]])
      },
      getAwardRecipientsByFundingOpportunityAsync: (number) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_award_recipients_by_funding_opportunity", [number]])
      },
      getAwardWithdrawalRequestAsync: (awardNumber, paymentNumber) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_award_withdrawal_request", [awardNumber, paymentNumber]])
      },
      getAwardWithdrawalRequestsByAwardAsync: (awardNumber) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_award_withdrawal_requests_by_award", [awardNumber]])
      },
      getAwardWithdrawalRequestsByAwardAndSubawardAsync: (awardNumber, subawardNumber) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_award_withdrawal_requests_by_award_and_subaward", [awardNumber, subawardNumber]])
      },
      getAwardWithdrawalRequestsByAwardAndStatusAsync: (awardNumber, status) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_award_withdrawal_requests_by_award_and_status", [awardNumber, status]])
      },
      getWithdrawalRequestsHistoryByAwardNumberAsync: (awardNumber) => {
        return chainService.rpcToChainNode("call", ["fo_history_api", "get_withdrawal_requests_history_by_award_number", [awardNumber]])
      },
      getWithdrawalRequestHistoryByAwardAndPaymentNumberAsync: (awardNumber, paymentNumber) => {
        return chainService.rpcToChainNode("call", ["fo_history_api", "get_withdrawal_request_history_by_award_and_payment_number", [awardNumber, paymentNumber]])
      },
      getWithdrawalRequestsHistoryByAwardAndSubawardNumberAsync: (awardNumber, subawardNumber) => {
        return chainService.rpcToChainNode("call", ["fo_history_api", "get_withdrawal_requests_history_by_award_and_subaward_number", [awardNumber, subawardNumber]])
      },
      getAssetAsync: (id) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_asset", [id]])
      },
      getAssetBySymbolAsync: (symbol) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_asset_by_symbol", [symbol]])
      },
      getAssetsByIssuerAsync: (issuer) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_assets_by_issuer", [issuer]])
      },
      getAssetsByTypeAsync: (type) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_assets_by_type", [type]])
      },
      getAssetsListAsync: (startIdx = 0, limit = LIST_LIMIT) => {
        return chainService.rpcToChainNode("call", ["database_api", "lookup_assets", [startIdx, limit]])
      },
      getFundingTransactionAsync: (id) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_funding_transaction", [id]])
      },
      getFundingTransactionsBySenderOrganisationAsync: (senderOrganisationId) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_funding_transactions_by_sender_organisation", [senderOrganisationId]])
      },
      getFundingTransactionsByReceiverOrganisationAsync: (receiverOrganisationId) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_funding_transactions_by_receiver_organisation", [receiverOrganisationId]])
      },
      getAssetStatisticsAsync: (symbol) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_asset_statistics", [symbol]])
      },
      getAssetBalanceByOwnerAsync: (owner, symbol) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_account_asset_balance", [owner, symbol]])
      },
      getAssetBalancesListAsync: (startIdx = 0, limit = LIST_LIMIT) => {
        throw new Error("Not implemented exception");
      },
      getAccountAssetsBalancesAsync: (owner) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_account_assets_balances", [owner]])
      },
      getAssetBalancesByAssetAsync: (symbol, startIdx = 0, limit = LIST_LIMIT) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_accounts_asset_balances_by_asset", [symbol]])
      },
      getProjectNdaAsync: (externalId) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_research_nda", [externalId]])
      },
      getProjectNdaByCreatorAsync: (creator) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_research_nda_by_creator", [creator]])
      },
      getProjectNdaByHashAsync: (hash) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_research_nda_by_hash", [hash]])
      },
      getProjectNdaByProjectAsync: (externalId) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_research_nda_by_research", [externalId]])
      },
      getNdaContractContentAccessRequestAsync: (externalId) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_nda_contract_content_access_request", [externalId]])
      },
      getNdaContractContentAccessRequestsByNdaAsync: (ndaExternalId) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_nda_contract_content_access_requests_by_nda", [ndaExternalId]])
      },
      getNdaContractContentAccessRequestsByRequesterAsync: (requester) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_nda_contract_content_access_requests_by_requester", [requester]])
      },
      getNdaContractRequestAsync: (id) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_nda_contract_request", [id]])
      },
      getNdaContractRequestsByContractIdAsync: (contractId) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_nda_contract_requests_by_contract_id", [contractId]])
      },
      getNdaContractRequestsByRequesterAsync: (requester) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_nda_contract_requests_by_requester", [requester]])
      },
      getNdaContractRequestByContractIdAndHashAsync: (contractId, encryptedPayloadHash) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_nda_contract_request_by_contract_id_and_hash", [contractId, encryptedPayloadHash]])
      },
      getSubscriptionAsync: (id) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_subscription", [id]])
      },
      getSubscriptionByTeamIdAsync: (teamId) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_subscription_by_research_group_id", [teamId]])
      },
      getSubscriptionsByOwnerAsync: (owner) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_subscriptions_by_owner", [owner]])
      },
      getContractAgreementAsync: (id) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_contract_agreement", [id]])
      },
      getContractAgreementsListAsync: (startIdx = 0, limit = LIST_LIMIT) => {
        throw new Error("Not implemented exception");
      },
      getContractAgreementsByTypeAsync: (type, startIdx = 0, limit = LIST_LIMIT) => {
        throw new Error("Not implemented exception");
      },
      getContractAgreementsByCreatorAsync: (creator) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_contract_agreement_by_creator", [creator]])
      },
      getOrganisationHistoryAsync: (organisationId) => {
        return chainService.rpcToChainNode("call", ["nsf_history_api", "get_organisation_history", [organisationId]])
      },
      getContentHistoryByHashAsync: (contentHash) => {
        return chainService.rpcToChainNode("call", ["ip_protection_history_api", "get_content_history_by_hash", [contentHash]])
      },
      getContentHistoryByProjectAndHashAsync: (projectId, contentHash) => {
        return chainService.rpcToChainNode("call", ["ip_protection_history_api", "get_content_history_by_research_and_hash", [projectId, contentHash]])
      },
      getContributionsHistoryByContributorAsync: (investor) => {
        return chainService.rpcToChainNode("call", ["tsc_history_api", "get_contributions_history_by_contributor", [investor]])
      },
      getContributionsHistoryByContributorAndProjectAsync: (investor, projectId) => {
        return chainService.rpcToChainNode("call", ["tsc_history_api", "get_contributions_history_by_contributor_and_research", [investor, projectId]])
      },
      getContributionsHistoryByProjectAsync: (projectId) => {
        return chainService.rpcToChainNode("call", ["tsc_history_api", "get_contributions_history_by_research", [projectId]])
      },
      getContributionsHistoryByTokenSaleAsync: (projectTokenSaleId) => {
        return chainService.rpcToChainNode("call", ["tsc_history_api", "get_contributions_history_by_token_sale", [projectTokenSaleId]])
      },
      getContentReferencesAsync: (projectContentId) => {
        return chainService.rpcToChainNode("call", ["research_content_reference_history_api", "get_content_references", [projectContentId]])
      },
      getContentReferences2Async: (projectContentExternalId) => {
        return chainService.rpcToChainNode("call", ["research_content_reference_history_api", "get_content_references2", [projectContentExternalId]])
      },
      getContentsReferToContentAsync: (projectContentId) => {
        return chainService.rpcToChainNode("call", ["research_content_reference_history_api", "get_contents_refer_to_content", [projectContentId]])
      },
      getContentsReferToContent2Async: (projectContentExternalId) => {
        return chainService.rpcToChainNode("call", ["research_content_reference_history_api", "get_contents_refer_to_content2", [projectContentExternalId]])
      },
      getProjectContentEciHistoryAsync: (projectContentExternalId, cursor, disciplineFilter, fromFilter, toFilter, contributionTypeFilter, assessmentCriteriaTypeFilter) => {
        return chainService.rpcToChainNode("call", ["eci_history_api", "get_research_content_eci_history", [projectContentExternalId, cursor, disciplineFilter, fromFilter, toFilter, contributionTypeFilter, assessmentCriteriaTypeFilter]])
      },
      getProjectContentEciStatsAsync: (projectContentExternalId, disciplineFilter, fromFilter, toFilter, contributionTypeFilter, assessmentCriteriaTypeFilter) => {
        return chainService.rpcToChainNode("call", ["eci_history_api", "get_research_content_eci_stats", [projectContentExternalId, disciplineFilter, fromFilter, toFilter, contributionTypeFilter, assessmentCriteriaTypeFilter]])
      },
      getProjectContentsEciStatsAsync: (disciplineFilter, fromFilter, toFilter, contributionTypeFilter, assessmentCriteriaTypeFilter) => {
        return chainService.rpcToChainNode("call", ["eci_history_api", "get_research_contents_eci_stats", [disciplineFilter, fromFilter, toFilter, contributionTypeFilter, assessmentCriteriaTypeFilter]])
      },
      getProjectEciHistoryAsync: (projectExternalId, cursor, disciplineFilter, fromFilter, toFilter, contributionTypeFilter, assessmentCriteriaTypeFilter) => {
        return chainService.rpcToChainNode("call", ["eci_history_api", "get_research_eci_history", [projectExternalId, cursor, disciplineFilter, fromFilter, toFilter, contributionTypeFilter, assessmentCriteriaTypeFilter]])
      },
      getProjectEciStatsAsync: (projectExternalId, disciplineFilter, fromFilter, toFilter, contributionTypeFilter, assessmentCriteriaTypeFilter) => {
        return chainService.rpcToChainNode("call", ["eci_history_api", "get_research_eci_stats", [projectExternalId, disciplineFilter, fromFilter, toFilter, contributionTypeFilter, assessmentCriteriaTypeFilter]])
      },
      getProjectsEciStatsAsync: (disciplineFilter, fromFilter, toFilter, contributionTypeFilter, assessmentCriteriaTypeFilter) => {
        return chainService.rpcToChainNode("call", ["eci_history_api", "get_researches_eci_stats", [disciplineFilter, fromFilter, toFilter, contributionTypeFilter, assessmentCriteriaTypeFilter]])
      },
      getAccountEciHistoryAsync: (account, cursor, disciplineFilter, fromFilter, toFilter, contributionTypeFilter, assessmentCriteriaTypeFilter) => {
        return chainService.rpcToChainNode("call", ["eci_history_api", "get_account_eci_history", [account, cursor, disciplineFilter, fromFilter, toFilter, contributionTypeFilter, assessmentCriteriaTypeFilter]])
      },
      getAccountEciStatsAsync: (account, disciplineFilter, fromFilter, toFilter, contributionTypeFilter, assessmentCriteriaTypeFilter) => {
        return chainService.rpcToChainNode("call", ["eci_history_api", "get_account_eci_stats", [account, disciplineFilter, fromFilter, toFilter, contributionTypeFilter, assessmentCriteriaTypeFilter]])
      },
      getAccountsEciStatsAsync: (disciplineFilter, fromFilter, toFilter, contributionTypeFilter, assessmentCriteriaTypeFilter) => {
        return chainService.rpcToChainNode("call", ["eci_history_api", "get_accounts_eci_stats", [disciplineFilter, fromFilter, toFilter, contributionTypeFilter, assessmentCriteriaTypeFilter]])
      },
      getDisciplinesEciStatsHistoryAsync: (fromFilter, toFilter, stepFilter) => {
        return chainService.rpcToChainNode("call", ["eci_history_api", "get_disciplines_eci_stats_history", [fromFilter, toFilter, stepFilter]])
      },
      getDisciplineEciHistoryAsync: (disciplineFilter, fromFilter, toFilter, contributionTypeFilter, assessmentCriteriaTypeFilter) => {
        return chainService.rpcToChainNode("call", ["eci_history_api", "get_discipline_eci_history", [disciplineFilter, fromFilter, toFilter, contributionTypeFilter, assessmentCriteriaTypeFilter]])
      },
      getDisciplinesEciLastStatsAsync: () => {
        return chainService.rpcToChainNode("call", ["eci_history_api", "get_disciplines_eci_last_stats", []])
      },
      getAccountRevenueHistoryBySecurityTokenAsync: (account, securityTokenExternalId, cursor, step, targetAssetSymbol) => {
        return chainService.rpcToChainNode("call", ["investments_history_api", "get_account_revenue_history_by_security_token", [account, securityTokenExternalId, cursor, step, targetAssetSymbol]])
      },
      getAccountRevenueHistoryAsync: (account, cursor) => {
        return chainService.rpcToChainNode("call", ["investments_history_api", "get_account_revenue_history", [account, cursor]])
      },
      getSecurityTokenRevenueHistoryAsync: (securityTokenExternalId, cursor) => {
        return chainService.rpcToChainNode("call", ["investments_history_api", "get_security_token_revenue_history", [securityTokenExternalId, cursor]])
      },
      getProposalsBySignerAsync: (account) => {
        return chainService.rpcToChainNode("call", ["proposal_history_api", "get_proposals_by_signer", [account]])
      },
      getProposalsBySignersAsync: (accounts) => {
        return chainService.rpcToChainNode("call", ["proposal_history_api", "get_proposals_by_signers", [accounts]])
      },
      getProposalStateAsync: (externalId) => {
        return chainService.rpcToChainNode("call", ["proposal_history_api", "get_proposal_state", [externalId]])
      },
      getProposalsStatesAsync: (externalIds) => {
        return chainService.rpcToChainNode("call", ["proposal_history_api", "get_proposals_states", [externalIds]])
      },
      lookupProposalsStatesAsync: (lowerBound, limit) => {
        return chainService.rpcToChainNode("call", ["proposal_history_api", "lookup_proposals_states", [lowerBound, limit]])
      },

      getProjectContentsListAsync: (startIdx = 0, limit = LIST_LIMIT) => { 
        return chainService.rpcToChainNode("call", ["database_api", "lookup_research_contents", [startIdx, limit]])
      },

      getAccountAsync: async (daoId) => {
         const accounts = await chainService.rpcToChainNode("call", ["database_api", "get_accounts", [[daoId]]]);
         return accounts[0] || null;
      },


    };

    return super(api);
  }
}


export default GrapheneChainRpc;