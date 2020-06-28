export default [{
  "api": "database_api",
  "method": "set_block_applied_callback",
  "params": ["cb"]
}, {
  "api": "database_api",
  "method": "get_state",
  "params": ["path"]
},
{
  "api": "database_api",
  "method": "get_config"
},
{
  "api": "database_api",
  "method": "get_dynamic_global_properties"
},
{
  "api": "database_api",
  "method": "get_chain_properties"
},
{
  "api": "database_api",
  "method": "get_witness_schedule"
},
{
  "api": "database_api",
  "method": "get_hardfork_version"
},
{
  "api": "database_api",
  "method": "get_next_scheduled_hardfork"
},
{
  "api": "account_by_key_api",
  "method": "get_key_references",
  "params": ["key"]
},
{
  "api": "database_api",
  "method": "get_accounts",
  "params": ["names"]
},
{
  "api": "database_api",
  "method": "get_account_references",
  "params": ["accountId"]
},
{
  "api": "database_api",
  "method": "lookup_account_names",
  "params": ["accountNames"]
},
{
  "api": "database_api",
  "method": "lookup_accounts",
  "params": ["lowerBoundName", "limit"]
},
{
  "api": "database_api",
  "method": "get_account_count"
},
{
  "api": "database_api",
  "method": "get_account_history",
  "params": ["account", "from", "limit"]
},
{
  "api": "database_api",
  "method": "get_owner_history",
  "params": ["account"]
},
{
  "api": "database_api",
  "method": "get_recovery_request",
  "params": ["account"]
},
{
  "api": "database_api",
  "method": "get_withdraw_routes",
  "params": ["account", "withdrawRouteType"]
},
{
  "api": "database_api",
  "method": "get_account_bandwidth",
  "params": ["account", "bandwidthType"]
},
{
  "api": "database_api",
  "method": "get_transaction_hex",
  "params": ["trx"]
},


// blockchain_history_api
{
  "api": "database_api", // TODO: Move to blockchain_history_api after refactoring delayed_node_plugin
  "method": "get_block",
  "params": ["blockNum"]
},
{
  api: 'blockchain_history_api',
  method: 'get_ops_history',
  params: ['from', 'limit', 'opt']
},
{
  "api": "blockchain_history_api",
  "method": "get_transaction",
  "params": ["trxId"]
},
{
  "api": "blockchain_history_api",
  "method": "get_block_header",
  "params": ["blockNum"]
},
{
  "api": "blockchain_history_api",
  "method": "get_ops_in_block",
  "params": ["blockNum", "onlyVirtual"]
},
{
  api: 'blockchain_history_api',
  method: 'get_blocks_history',
  params: ['from', 'limit']
},

// account_history_api
{
  "api": "account_history_api",
  "method": "get_account_deip_to_deip_transfers",
  "params": ["account", "from", "limit"]
},

{
  "api": "database_api",
  "method": "get_required_signatures",
  "params": ["trx", "availableKeys"]
},
{
  "api": "database_api",
  "method": "get_potential_signatures",
  "params": ["trx"]
},
{
  "api": "database_api",
  "method": "verify_authority",
  "params": ["trx"]
},
{
  "api": "database_api",
  "method": "verify_account_authority",
  "params": ["nameOrId", "signers"]
},
{
  "api": "database_api",
  "method": "get_witnesses",
  "params": ["witnessIds"]
},
{
  "api": "database_api",
  "method": "get_witness_by_account",
  "params": ["accountName"]
},
{
  "api": "database_api",
  "method": "get_witnesses_by_vote",
  "params": ["from", "limit"]
},
{
  "api": "database_api",
  "method": "lookup_witness_accounts",
  "params": ["lowerBoundName", "limit"]
},
{
  "api": "database_api",
  "method": "get_witness_count"
},
{
  "api": "database_api",
  "method": "get_active_witnesses"
},
{
  "api": "database_api",
  "method": "get_reward_fund",
  "params": ["name"]
},
{
  "api": "login_api",
  "method": "login",
  "params": ["username", "password"]
},
{
  "api": "login_api",
  "method": "get_api_by_name",
  "params": ["database_api"]
},
{
  "api": "login_api",
  "method": "get_version"
},
{
  "api": "network_broadcast_api",
  "method": "broadcast_transaction",
  "params": ["trx"]
},
{
  "api": "network_broadcast_api",
  "method": "broadcast_transaction_with_callback",
  "params": ["confirmationCallback", "trx"]
},
{
  "api": "network_broadcast_api",
  "method": "broadcast_transaction_synchronous",
  "params": ["trx"]
},
{
  "api": "network_broadcast_api",
  "method": "broadcast_block",
  "params": ["b"]
},
{
  "api": "network_broadcast_api",
  "method": "set_max_block_age",
  "params": ["maxBlockAge"]
},
{
  "api": "database_api",
  "method": "get_research_group",
  "params": [
    "account"
  ]
},
{
  "api": "database_api",
  "method": "lookup_research_groups",
  "params": [
    "lower_bound",
    "limit"
  ]
},
{
  "api": "database_api",
  "method": "get_research_groups",
  "params": [
    "ids"
  ]
},
{
  "api": "database_api",
  "method": "get_research_groups_by_member",
  "params": [
    "member"
  ]
},
{
  "api": "database_api",
  "method": "get_research_group_by_permlink",
  "params": [
    "permlink"
  ]
},
{
  "api": "database_api",
  "method": "get_research_group_by_id",
  "params": [
    "id"
  ]
},
{
  "api": "database_api",
  "method": "get_research_group_tokens_by_research_group",
  "params": [
    "research_group_id"
  ]
},
{
  "api": "database_api",
  "method": "get_research_group_tokens_by_account",
  "params": [
    "account"
  ]
},
{
  "api": "database_api",
  "method": "get_review_votes_by_review_id",
  "params": [
    "review_id"
  ]
},
{
  "api": "database_api",
  "method": "get_review_votes_by_review",
  "params": [
    "review_external_id"
  ]
},
{
  "api": "database_api",
  "method": "get_review_votes_by_voter",
  "params": [
    "account"
  ]
},
{
  "api": "database_api",
  "method": "get_researches_by_research_group",
  "params": [
    "external_id"
  ]
},
{
  "api": "database_api",
  "method": "get_schema"
},
{
  "api": "database_api",
  "method": "get_expiring_vesting_delegations",
  "params": [
    "account",
    "from",
    "limit"
  ]
},
{
  "api": "database_api",
  "method": "lookup_disciplines",
  "params": [
    "lower_bound",
    "limit"
  ]
},
{
  "api": "database_api",
  "method": "get_discipline",
  "params": [
    "external_id"
  ]
},
{
  "api": "database_api",
  "method": "get_discipline_by_name",
  "params": [
    "name"
  ]
},
{
  "api": "database_api",
  "method": "get_disciplines_by_parent",
  "params": [
    "parent_external_id"
  ]
},
{
  "api": "database_api",
  "method": "get_research",
  "params": [
    "id"
  ]
},
{
  "api": "database_api",
  "method": "lookup_researches",
  "params": [
    "lower_bound",
    "limit"
  ]
},
{
  "api": "database_api",
  "method": "get_research_by_id",
  "params": [
    "id"
  ]
},
{
  "api": "database_api",
  "method": "get_research_by_permlink",
  "params": [
    "research_group_id",
    "permlink"
  ]
},

{
  "api": "database_api",
  "method": "get_research_by_absolute_permlink",
  "params": [
    "research_group_permlink",
    "research_permlink"
  ]
},
{
  "api": "database_api",
  "method": "get_researches",
  "params": [
    "ids"
  ]
},
{
  "api": "database_api",
  "method": "get_researches_by_research_group_member",
  "params": [
    "member"
  ]
},
{
  "api": "database_api",
  "method": "get_research_contents_by_research",
  "params": [
    "external_id",
  ]
},
{
  "api": "database_api",
  "method": "get_research_content",
  "params": [
    "external_id"
  ]
},
{
  "api": "database_api",
  "method": "get_research_contents",
  "params": [
    "ids"
  ]
},
{
  "api": "database_api",
  "method": "get_research_content_by_id",
  "params": [
    "id"
  ]
},
{
  "api": "database_api",
  "method": "get_research_content_by_type",
  "params": [
    "research_id",
    "type"
  ]
},
{
  "api": "database_api",
  "method": "get_research_content_by_permlink",
  "params": [
    "research_id",
    "permlink"
  ]
},
{
  "api": "database_api",
  "method": "get_research_content_by_absolute_permlink",
  "params": [
    "research_group_permlink",
    "research_permlink",
    "research_content_permlink"
  ]
},
{
  "api": "database_api",
  "method": "get_expert_token",
  "params": [
    "id"
  ]
},
{
  "api": "database_api",
  "method": "get_expert_tokens_by_account_name",
  "params": [
    "account_name"
  ]
},
{
  "api": "database_api",
  "method": "get_expert_tokens_by_discipline",
  "params": [
    "discipline_external_id"
  ]
},
{
  "api": "database_api",
  "method": "get_proposal",
  "params": [
    "id"
  ]
},
{
  "api": "database_api",
  "method": "get_proposals_by_creator",
  "params": [
    "creator"
  ]
},
{
  "api": "database_api",
  "method": "get_research_group_token_by_account_and_research_group_id",
  "params": [
    "account",
    "research_group_id"
  ]
},
{
  "api": "database_api",
  "method": "get_research_token_sale",
  "params": [
    "from",
    "limit"
  ]
},
{
  "api": "database_api",
  "method": "get_research_token_sale_by_id",
  "params": [
    "research_token_sale_id"
  ]
},
{
  "api": "database_api",
  "method": "get_research_token_sales_by_research_id",
  "params": [
    "research_id"
  ]
},
{
  "api": "database_api",
  "method": "get_research_token_sale_by_end_time",
  "params": [
    "end_time"
  ]
},
{
  "api": "database_api",
  "method": "get_research_token_sales_by_research_id_and_status",
  "params": [
    "research_id",
    "status"
  ]
},
{
  "api": "database_api",
  "method": "get_research_token_sale_contribution_by_id",
  "params": [
    "research_token_sale_contribution_id"
  ]
},
{
  "api": "database_api",
  "method": "get_research_token_sale_contributions_by_research_token_sale_id",
  "params": [
    "research_token_sale_id"
  ]
},
{
  "api": "database_api",
  "method": "get_research_token_sale_contribution_by_contributor_and_research_token_sale_id",
  "params": [
    "owner",
    "research_token_sale_id"
  ]
},
{
  "api": "database_api",
  "method": "get_research_token_sale_contributions_by_contributor",
  "params": [
    "owner"
  ]
},
{
  "api": "database_api",
  "method": "get_disciplines_by_research",
  "params": [
    "research_id"
  ]
},
{
  "api": "database_api",
  "method": "check_research_existence_by_permlink",
  "params": [
    "research_group_id",
    "permlink"
  ]
},
{
  "api": "database_api",
  "method": "check_research_group_existence_by_permlink",
  "params": [
    "permlink"
  ]
},
{
  "api": "database_api",
  "method": "get_expertise_contribution_by_research_content_and_discipline",
  "params": [
    "research_content_id",
    "discipline_id"
  ]
},
{
  "api": "database_api",
  "method": "get_expertise_contributions_by_research",
  "params": [
    "research_id"
  ]
},
{
  "api": "database_api",
  "method": "get_expertise_contributions_by_research_and_discipline",
  "params": [
    "research_id",
    "discipline_id"
  ]
},
{
  "api": "database_api",
  "method": "get_expertise_contributions_by_research_content",
  "params": [
    "research_content_id"
  ]
},
{
  "api": "database_api",
  "method": "lookup_witness_accounts",
  "params": [
    "lower_bound_name",
    "limit"
  ]
},
{
  "api": "database_api",
  "method": "get_witness_by_account",
  "params": [
    "account_name"
  ]
},
{
  "api": "database_api",
  "method": "get_review",
  "params": [
    "external_id"
  ]
},
{
  "api": "database_api",
  "method": "get_review_by_id",
  "params": [
    "review_id"
  ]
},
{
  "api": "database_api",
  "method": "get_reviews_by_research_content",
  "params": [
    "research_content_external_id"
  ]
},
{
  "api": "database_api",
  "method": "get_reviews_by_research",
  "params": [
    "research_external_id"
  ]
},
{
  "api": "database_api",
  "method": "get_research_token_by_id",
  "params": [
    "research_token_id"
  ]
},
{
  "api": "database_api",
  "method": "get_research_tokens_by_account_name",
  "params": [
    "account_name"
  ]
},
{
  "api": "database_api",
  "method": "get_research_tokens_by_research_id",
  "params": [
    "research_id"
  ]
},
{
  "api": "database_api",
  "method": "get_research_token_by_account_name_and_research_id",
  "params": [
    "account_name",
    "research_id"
  ]
},
{
  "api": "database_api",
  "method": "get_expertise_allocation_proposal_by_id",
  "params": [
    "id"
  ]
},
{
  "api": "database_api",
  "method": "get_expertise_allocation_proposals_by_initiator",
  "params": [
    "initiator"
  ]
},
{
  "api": "database_api",
  "method": "get_expertise_allocation_proposals_by_claimer_and_discipline",
  "params": [
    "claimer",
    "discipline_id"
  ]
},
{
  "api": "database_api",
  "method": "get_expertise_allocation_proposal_by_discipline_initiator_and_claimer",
  "params": [
    "discipline_id",
    "initiator",
    "claimer"
  ]
},
{
  "api": "database_api",
  "method": "get_expertise_allocation_proposals_by_discipline",
  "params": [
    "discipline_id"
  ]
},
{
  "api": "database_api",
  "method": "get_expertise_allocation_proposal_vote_by_id",
  "params": [
    "id"
  ]
},
{
  "api": "database_api",
  "method": "get_expertise_allocation_proposal_votes_by_expertise_allocation_proposal_id",
  "params": [
    "expertise_allocation_proposal_id"
  ]
},
{
  "api": "database_api",
  "method": "get_expertise_allocation_proposal_vote_by_voter_and_expertise_allocation_proposal_id",
  "params": [
    "voter",
    "expertise_allocation_proposal_id"
  ]
},
{
  "api": "database_api",
  "method": "get_expertise_allocation_proposal_votes_by_voter_and_discipline_id",
  "params": [
    "voter",
    "discipline_id"
  ]
},
{
  "api": "database_api",
  "method": "get_expertise_allocation_proposal_votes_by_voter",
  "params": [
    "voter"
  ]
},
{
  "api": "database_api",
  "method": "get_accounts_by_expert_discipline",
  "params": [
    "discipline_id",
    "from",
    "limit"
  ]
},
{
  "api": "database_api",
  "method": "get_reviews_by_author",
  "params": [
    "author",
  ]
},
// Grants

/* FOA */
{
  "api": "database_api",
  "method": "get_funding_opportunity_announcement",
  "params": [
    "id",
  ]
},
{
  "api": "database_api",
  "method": "get_funding_opportunity_announcement_by_number",
  "params": [
    "number",
  ]
},
{
  "api": "database_api",
  "method": "get_funding_opportunity_announcements_by_organization",
  "params": [
    "research_group_id",
  ]
},

/* Grants with announced application window */
{
  "api": "database_api",
  "method": "get_funding_opportunity_announcements_listing",
  "params": [
    "page",
    "limit"
  ]
},
{
  "api": "database_api",
  "method": "get_grant_with_announced_application_window",
  "params": [
    "id"
  ]
},
{
  "api": "database_api",
  "method": "get_grants_with_announced_application_window_by_grantor",
  "params": [
    "grantor"
  ]
},
{
  "api": "database_api",
  "method": "get_grant_application",
  "params": [
    "id"
  ]
},
{
  "api": "database_api",
  "method": "get_grant_applications_by_grant",
  "params": [
    "grant_id"
  ]
},
{
  "api": "database_api",
  "method": "get_grant_applications_by_research_id",
  "params": [
    "research_id"
  ]
},
// Grant applications reviews
{
  "api": "database_api",
  "method": "get_grant_application_review",
  "params": [
    "id"
  ]
},
{
  "api": "database_api",
  "method": "get_grant_application_reviews_by_author",
  "params": [
    "author"
  ]
},
{
  "api": "database_api",
  "method": "get_grant_application_review_by_author_and_application",
  "params": [
    "author",
    "grant_applicaiton_id"
  ]
},
{
  "api": "database_api",
  "method": "get_grant_application_reviews_by_grant_application",
  "params": [
    "grant_application_id"
  ]
},

// FOA awards
{
  "api": "database_api",
  "method": "get_award",
  "params": [
    "award_number"
  ]
},
{
  "api": "database_api",
  "method": "get_awards_by_funding_opportunity",
  "params": [
    "funding_opportunity_number"
  ]
},
{
  "api": "database_api",
  "method": "get_award_recipient",
  "params": [
    "id"
  ]
},
{
  "api": "database_api",
  "method": "get_award_recipients_by_award",
  "params": [
    "award_number"
  ]
},
{
  "api": "database_api",
  "method": "get_award_recipients_by_account",
  "params": [
    "awardee"
  ]
},
{
  "api": "database_api",
  "method": "get_award_recipients_by_funding_opportunity",
  "params": [
    "number"
  ]
},
{
  "api": "database_api",
  "method": "get_award_withdrawal_request",
  "params": [
    "award_number",
    "payment_number"
  ]
},
{
  "api": "database_api",
  "method": "get_award_withdrawal_requests_by_award",
  "params": [
    "award_number"
  ]
},
{
  "api": "database_api",
  "method": "get_award_withdrawal_requests_by_award_and_subaward",
  "params": [
    "award_number",
    "subaward_number"
  ]
},
{
  "api": "database_api",
  "method": "get_award_withdrawal_requests_by_award_and_status",
  "params": [
    "award_number",
    "status"
  ]
},
{
  "api": "fo_history_api",
  "method": "get_withdrawal_requests_history_by_award_number",
  "params": [
    "award_number"
  ]
},
{
  "api": "fo_history_api",
  "method": "get_withdrawal_request_history_by_award_and_payment_number",
  "params": [
    "award_number",
    "payment_number"
  ]
},
{
  "api": "fo_history_api",
  "method": "get_withdrawal_requests_history_by_award_and_subaward_number",
  "params": [
    "award_number",
    "subaward_number"
  ]
},

// Assets
{
  "api": "database_api",
  "method": "get_asset",
  "params": [
    "id"
  ]
},
{
  "api": "database_api",
  "method": "get_asset_by_string_symbol",
  "params": [
    "string_symbol"
  ]
},

// Funding Transactions
{
  "api": "database_api",
  "method": "get_funding_transaction",
  "params": [
    "id"
  ]
},
{
  "api": "database_api",
  "method": "get_funding_transactions_by_sender_organisation",
  "params": [
    "sender_organisation_id"
  ]
},
{
  "api": "database_api",
  "method": "get_funding_transactions_by_receiver_organisation",
  "params": [
    "receiver_organisation_id"
  ]
},
{
  "api": "database_api",
  "method": "get_asset_statistics",
  "params": [
    "symbol"
  ]
},

// Account Balances
{
  "api": "database_api",
  "method": "get_account_balance",
  "params": [
    "id"
  ]
},
{
  "api": "database_api",
  "method": "get_account_balances_by_owner",
  "params": [
    "owner"
  ]
},
{
  "api": "database_api",
  "method": "get_account_balance_by_owner_and_asset_symbol",
  "params": [
    "owner",
    "symbol"
  ]
},

// NDA Contracts
{
  "api": "database_api",
  "method": "get_nda_contract",
  "params": [
    "id"
  ]
},
{
  "api": "database_api",
  "method": "get_nda_contracts_by_creator",
  "params": [
    "creator"
  ]
},
{
  "api": "database_api",
  "method": "get_nda_contracts_by_signee",
  "params": [
    "signee"
  ]
},
{
  "api": "database_api",
  "method": "get_nda_contracts_by_hash",
  "params": [
    "hash"
  ]
},
{
  "api": "database_api",
  "method": "get_nda_contracts_by_creator_research_group",
  "params": [
    "research_group_id"
  ]
},
{
  "api": "database_api",
  "method": "get_nda_contracts_by_signee_research_group",
  "params": [
    "research_group_id"
  ]
},
{
  "api": "database_api",
  "method": "get_nda_contracts_by_creator_research_group_and_contract_hash",
  "params": [
    "research_group_id",
    "hash"
  ]
},
{
  "api": "database_api",
  "method": "get_nda_contracts_by_signee_research_group_and_contract_hash",
  "params": [
    "research_group_id",
    "hash"
  ]
},
{
  "api": "database_api",
  "method": "get_nda_contracts_by_creator_research_group_and_signee_research_group",
  "params": [
    "creator_research_group_id",
    "signee_research_group_id"
  ]
},
{
  "api": "database_api",
  "method": "get_nda_contracts_by_creator_research_group_and_signee_research_group_and_contract_hash",
  "params": [
    "creator_research_group_id",
    "signee_research_group_id",
    "hash"
  ]
},

// NDA Contracts requests
{
  "api": "database_api",
  "method": "get_nda_contract_request",
  "params": [
    "id"
  ]
},
{
  "api": "database_api",
  "method": "get_nda_contract_requests_by_contract_id",
  "params": [
    "contract_id"
  ]
},
{
  "api": "database_api",
  "method": "get_nda_contract_requests_by_requester",
  "params": [
    "requester"
  ]
},
{
  "api": "database_api",
  "method": "get_nda_contract_request_by_contract_id_and_hash",
  "params": [
    "contract_id",
    "encrypted_payload_hash"
  ]
},

// Subscription quota
{
  "api": "database_api",
  "method": "get_subscription",
  "params": [
    "id"
  ]
},
{
  "api": "database_api",
  "method": "get_subscription_by_research_group_id",
  "params": [
    "research_group_id"
  ]
},
{
  "api": "database_api",
  "method": "get_subscriptions_by_owner",
  "params": [
    "owner"
  ]
},

// NSF History plugin
{
  "api": "nsf_history_api",
  "method": "get_organisation_history",
  "params": [
    "organisation_id"
  ]
},

// IP Protection Plugin
{
  "api": "ip_protection_history_api",
  "method": "get_content_history_by_hash",
  "params": [
    "content_hash"
  ]
},
{
  "api": "ip_protection_history_api",
  "method": "get_content_history_by_research_and_hash",
  "params": [
    "research_id",
    "content_hash"
  ]
},

// Token Sales Plugin
{
  "api": "tsc_history_api",
  "method": "get_contributions_history_by_contributor",
  "params": [
    "contributor"
  ]
},
{
  "api": "tsc_history_api",
  "method": "get_contributions_history_by_contributor_and_research",
  "params": [
    "contributor",
    "research_id"
  ]
},
// Research Content References Plugin
{
  "api": "research_content_reference_history_api",
  "method": "get_content_references",
  "params": [
    "research_content_id"
  ]
},
{
  "api": "research_content_reference_history_api",
  "method": "get_contents_refer_to_content",
  "params": [
    "research_content_id"
  ]
},
// ECI History Plugin
{
  "api": "eci_history_api",
  "method": "get_eci_history_by_research_content_and_discipline",
  "params": [
    "research_content_id",
    "discipline_id"
  ]
},
{
  "api": "eci_history_api",
  "method": "get_eci_history_by_research_and_discipline",
  "params": [
    "research_id",
    "discipline_id"
  ]
},
{
  "api": "eci_history_api",
  "method": "get_eci_history_by_account_and_discipline",
  "params": [
    "account",
    "discipline_id"
  ]
},
{
  "api": "eci_history_api",
  "method": "get_accounts_eci_stats",
  "params": [
    "discipline_external_id"
  ]
}
];