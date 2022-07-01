import BaseChainRpc from './../../../base/rpc/BaseChainRpc';
import GrapheneDaoDto from './response/dto/GrapheneDaoDto';
import GrapheneAssetDto from './response/dto/GrapheneAssetDto';
import GrapheneFungibleTokenBalanceDto from './response/dto/GrapheneFungibleTokenBalanceDto';
import GrapheneInvestmentOpportunityDto from './response/dto/GrapheneInvestmentOpportunityDto';
import GrapheneContractAgreementDto from './response/dto/GrapheneContractAgreementDto';
import GrapheneProposalDto from './response/dto/GrapheneProposalDto';



class GrapheneChainRpc extends BaseChainRpc {

  constructor(chainService, {
    coreAsset
  }) {

    const LIST_LIMIT = 1000;

    const api = {

      sendTxAsync: (rawTx) => {
        return chainService.rpcToChainNode("call", ["network_broadcast_api", "broadcast_transaction_synchronous", [rawTx]]);
      },



      /* DAO */

      getAccountAsync: async (daoId) => {
        const [dao] = await chainService.rpcToChainNode("call", ["database_api", "get_accounts", [[daoId]]]);
        if (!dao) return null;
        return new GrapheneDaoDto(dao);
      },

      getAccountsAsync: async (daoIds) => {
        const list = await chainService.rpcToChainNode("call", ["database_api", "get_accounts", [daoIds]]);
        return list.filter((dao) => !!dao).map((dao) => new GrapheneDaoDto(dao));
      },

      getAccountsListAsync: async (startIdx = 0, limit = LIST_LIMIT) => {
        const list = await chainService.rpcToChainNode("call", ["database_api", "lookup_accounts", [startIdx, limit]]);
        return list.map((dao) => new GrapheneDaoDto(dao));
      },


      /* ASSET */

      getFungibleTokenAsync: async (assetId) => {
        throw new Error("Not implemented exception");
      },

      getFungibleTokenBySymbolAsync: async (symbol) => {
        const asset = await chainService.rpcToChainNode("call", ["database_api", "get_asset_by_symbol", [symbol]]);
        if (!asset) return null;
        return new GrapheneAssetDto(asset);
      },

      getFungibleTokenListAsync: async () => {
        const assets = await chainService.rpcToChainNode("call", ["database_api", "lookup_assets", [9, 1000]]);
        return assets.map((asset) => (new GrapheneAssetDto(asset)));
      },

      getProjectAssetsAsync: async (projectId) => {
        const assets = await chainService.rpcToChainNode("call", ["database_api", "get_assets_by_type", [2]]);
        const assetsDtos = await Promise.all(assets
          .filter((asset) => asset.tokenized_research == projectId)
          .map((asset) => this.getFungibleTokenBySymbolAsync(asset.string_symbol))
        );
        return assetsDtos;
      },



      /* ASSET BALANCE */

      getFungibleTokenBalanceByOwnerAsync: async (daoId, assetId) => {
        throw new Error("Not implemented exception");
      },

      getFungibleTokenBalanceByOwnerAndSymbolAsync: async (daoId, symbol) => {
        const balance = await chainService.rpcToChainNode("call", ["database_api", "get_account_asset_balance", [daoId, symbol]]);
        if (!balance) return null;
        return new GrapheneFungibleTokenBalanceDto(balance);
      },

      getFungibleTokenBalancesByOwnerAsync: async (daoId) => {
        const balances = await chainService.rpcToChainNode("call", ["database_api", "get_account_assets_balances", [daoId]]);
        return balances.map((balance) => (new GrapheneFungibleTokenBalanceDto(balance)));
      },

      getFungibleTokenBalancesAsync: async (assetId) => {
        throw new Error("Not implemented exception");
      },

      getFungibleTokenBalancesBySymbolAsync: async (symbol) => {
        const balances = await chainService.rpcToChainNode("call", ["database_api", "get_accounts_asset_balances_by_asset", [symbol]]);
        return balances.map((balance) => (new GrapheneFungibleTokenBalanceDto(balance)));
      },
      
      getFungibleTokenBalancesListAsync: (withCore) => {
        throw new Error("Not implemented exception");
      },



      /* INVESTMENT OPPORTUNITY */

      getInvestmentOpportunityAsync: async (invstOppId) => {
        const invstOpp = await chainService.rpcToChainNode("call", ["database_api", "get_research_token_sale", [invstOppId]]);
        if (!invstOpp) return null;
        return new GrapheneInvestmentOpportunityDto(invstOpp);
      },

      getInvestmentOpportunitiesListAsync: async (startIdx = 0, limit = LIST_LIMIT) => {
        const invstOpps = await chainService.rpcToChainNode("call", ["database_api", "get_research_token_sales", [startIdx, limit]]);
        return invstOpps.map((invstOpp => (new GrapheneInvestmentOpportunityDto(invstOpp))));
      },



      /* CONTRACT AGREEMENT */

      getContractAgreementAsync: async (agreementId) => {
        const agreement = await chainService.rpcToChainNode("call", ["database_api", "get_contract_agreement", [agreementId]]);
        if (!agreement) return null;
        return new GrapheneContractAgreementDto(agreement);
      },

      getContractAgreementsListAsync: async (startIdx = 0, limit = LIST_LIMIT) => {
        throw new Error("Not implemented exception");
      },

      getContractAgreementsByTypeAsync: async (type, startIdx = 0, limit = LIST_LIMIT) => {
        throw new Error("Not implemented exception");
      },



      /* PROPOSAL */

      getProposalAsync: async (proposalId) => {
        const proposal = await chainService.rpcToChainNode("call", ["proposal_history_api", "get_proposal_state", [proposalId]]);
        if (!proposal) return null;
        return new GrapheneProposalDto(proposal);
      },

      getProposalsListAsync: async (startIdx = 0, limit = LIST_LIMIT) => {
        throw new Error("Not implemented exception");
      },

      getProposalsByCreatorAsync: async (creator, startIdx = 0, limit = LIST_LIMIT) => {
        const proposals = await chainService.rpcToChainNode("call", ["database_api", "get_proposals_by_creator", [creator]]);
        const list = await Promise.all(proposals.map((proposal) => this.getProposalAsync(proposal.external_id)));
        return list;
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

      getAccountReferencesAsync: (accountId) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_account_references", [accountId]])
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
      getSchemaAsync: () => {
        return chainService.rpcToChainNode("call", ["database_api", "get_schema", []])
      },
      getExpiringVestingDelegationsAsync: (account, from, limit) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_expiring_vesting_delegations", [account, from, limit]])
      },
      getProjectByPermlinkAsync: (teamId, permlink) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_research_by_permlink", [teamId, permlink]])
      },
      getProjectByAbsolutePermlinkAsync: (teamPermlink, projectPermlink) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_research_by_absolute_permlink", [teamPermlink, projectPermlink]])
      },
      getProjectLicenseAsync: (id) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_research_license", [id]])
      },
      getProjectLicensesAsync: (ids) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_research_licenses", [ids]])
      },
      getProjectLicensesByLicenseeAsync: (licensee) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_research_licenses_by_licensee", [licensee]])
      },
      getProjectLicensesByLicenserAsync: (licenser) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_research_licenses_by_licenser", [licenser]])
      },
      getProjectLicensesByProjectAsync: (projectId) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_research_licenses_by_research", [projectId]])
      },
      getProjectLicensesByLicenseeAndProjectAsync: (licensee, projectId) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_research_licenses_by_licensee_and_research", [licensee, projectId]])
      },
      getProjectLicensesByLicenseeAndLicenserAsync: (licensee, licenser) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_research_licenses_by_licensee_and_licenser", [licensee, licenser]])
      },
      getExpertTokenAsync: (id) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_expert_token", [id]])
      },
      getExpertTokensByAccountNameAsync: (accountName) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_expert_tokens_by_account_name", [accountName]])
      },
      getTeamTokenByAccountAndProjectGroupIdAsync: (account, teamId) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_research_group_token_by_account_and_research_group_id", [account, teamId]])
      },
      checkTeamExistenceByPermlinkAsync: (name) => {
        return chainService.rpcToChainNode("call", ["database_api", "check_research_group_existence_by_permlink", [name]])
      },
      checkProjectExistenceByPermlinkAsync: (teamId, title) => {
        return chainService.rpcToChainNode("call", ["database_api", "check_research_existence_by_permlink", [teamId, title]])
      },
      lookupWitnessAccountsAsync: (lowerBoundName, limit) => {
        return chainService.rpcToChainNode("call", ["database_api", "lookup_witness_accounts", [lowerBoundName, limit]])
      },
      getWitnessByAccountAsync: (accountName) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_witness_by_account", [accountName]])
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
      getFungibleTokenByIssuerAsync: (issuer) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_assets_by_issuer", [issuer]])
      },
      getFungibleTokenByTypeAsync: (type) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_assets_by_type", [type]])
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
      getAssetStatisticsAsync: (assetSymbol) => {
        return chainService.rpcToChainNode("call", ["database_api", "get_asset_statistics", [assetSymbol]])
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
      getProposalsBySignerAsync: (account) => {
        return chainService.rpcToChainNode("call", ["proposal_history_api", "get_proposals_by_signer", [account]])
      },
      getProposalsBySignersAsync: (accounts) => {
        return chainService.rpcToChainNode("call", ["proposal_history_api", "get_proposals_by_signers", [accounts]])
      },
      getProposalStateAsync: (id) => {
        return chainService.rpcToChainNode("call", ["proposal_history_api", "get_proposal_state", [id]])
      },
      getProposalsStatesAsync: (ids) => {
        return chainService.rpcToChainNode("call", ["proposal_history_api", "get_proposals_states", [ids]])
      },
      lookupProposalsStatesAsync: (lowerBound, limit) => {
        return chainService.rpcToChainNode("call", ["proposal_history_api", "lookup_proposals_states", [lowerBound, limit]])
      }

    };

    return super(api);
  }
}


export default GrapheneChainRpc;