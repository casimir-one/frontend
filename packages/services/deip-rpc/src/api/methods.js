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
    "method": "get_all_research_groups",
    "params": [
        "is_personal_need"
    ]
},
{
    "api": "database_api",
    "method": "get_proposals_by_research_group_id",
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
    "method": "get_review_votes_by_voter",
    "params": [
        "account"
    ]
},
{
    "api": "database_api",
    "method": "get_researches_by_research_group_id",
    "params": [
        "research_group_id"
    ]
},
{
    "api": "database_api",
    "method": "get_research_group_invites_by_account_name",
    "params": [
        "account_name"
    ]
},
{
    "api": "database_api",
    "method": "get_research_group_invites_by_research_group_id",
    "params": [
        "research_group_id"
    ]
},
{
    "api": "database_api",
    "method": "get_schema"
},
{
    "api": "database_api",
    "method": "get_grants",
    "params": [
        "account_names"
    ]
},
{
    "api": "database_api",
    "method": "lookup_grant_owners",
    "params": [
        "lower_bound_name",
        "limit"
    ]
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
    "method": "get_all_disciplines"
},
{
    "api": "database_api",
    "method": "get_discipline",
    "params": [
        "id"
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
    "method": "get_disciplines_by_parent_id",
    "params": [
        "parent_id"
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
        "from",
        "limit"
    ]
},
{
    "api": "database_api",
    "method": "get_research_listing",
    "params": [
        "from",
        "limit"
    ]
},
{
    "api": "database_api",
    "method": "get_all_researches_listing",
    "params": [
        "discipline_id",
        "limit"
    ]
},
{
    "api": "database_api",
    "method": "get_all_research_content",
    "params": [
        "research_id",
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
    "method": "get_expert_tokens_by_discipline_id",
    "params": [
        "discipline_id"
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
    "method": "get_research_group_invite_by_id",
    "params": [
        "research_group_invite_id"
    ]
},
{
    "api": "database_api",
    "method": "get_research_group_invite_by_account_name_and_research_group_id",
    "params": [
        "account_name",
        "research_group_id"
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
    "method": "get_total_votes_by_research",
    "params": [
        "research_id"
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
    "method": "get_total_votes_by_research_and_discipline",
    "params": [
        "research_id",
        "discipline_id"
    ]
},
{
    "api": "database_api",
    "method": "get_all_accounts",
    "params": []
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
    "method": "get_reviews_by_content",
    "params": [
        "research_content_id"
    ]
},
{
    "api": "database_api",
    "method": "get_reviews_by_research",
    "params": [
        "research_id"
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
    "method": "get_eci_and_expertise_stats_by_discipline_id",
    "params": [
        "discipline_id"
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
{
    "api": "database_api",
    "method": "get_funding_opportunity",
    "params": [
        "id"
    ]
},
{
    "api": "database_api",
    "method": "get_funding_opportunities_by_target_discipline",
    "params": [
        "discipline_id"
    ]
},
{
    "api": "database_api",
    "method": "get_funding_opportunities",
    "params": [
        "account_names"
    ]
},
{
    "api": "database_api",
    "method": "lookup_funding_opportunity_owners",
    "params": [
        "lower_bound_name",
        "limit"
    ]
},
{
    "api": "database_api",
    "method": "get_funding_opportunities_by_agency_name",
    "params": [
        "agency_name"
    ]
},
{
    "api": "database_api",
    "method": "get_funding_opportunities_by_opportunity_number",
    "params": [
        "funding_opportunity_number"
    ]
},
{
    "api": "database_api",
    "method": "get_all_funding_opportunity_listing",
    "params": [
        "limit"
    ]
},
// Grant applications
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
// Funding Contracts
{
    "api": "database_api",
    "method": "get_funding",
    "params": [
        "id"
    ]
},
{
    "api": "database_api",
    "method": "get_fundings",
    "params": []
},
{
    "api": "database_api",
    "method": "get_fundings_by_granter",
    "params": [
        "granter"
    ]
},
{
    "api": "database_api",
    "method": "get_funding_research_relation",
    "params": [
        "id"
    ]
},
{
    "api": "database_api",
    "method": "get_funding_research_relations_by_funding",
    "params": [
        "funding_id"
    ]
},
{
    "api": "database_api",
    "method": "get_funding_research_relation_by_funding_and_research",
    "params": [
        "funding_id",
        "research_id"
    ]
},
{
    "api": "database_api",
    "method": "get_funding_withdrawal_request",
    "params": [
        "id"
    ]
},
{
    "api": "database_api",
    "method": "get_funding_withdrawal_requests",
    "params": []
},
{
    "api": "database_api",
    "method": "get_funding_withdrawal_requests_by_research",
    "params": [
        "research_id"
    ]
},
{
    "api": "database_api",
    "method": "get_funding_withdrawal_requests_by_organisation",
    "params": [
        "organisation_id"
    ]
},
{
    "api": "database_api",
    "method": "get_funding_milestone",
    "params": [
        "id"
    ]
},
{
    "api": "database_api",
    "method": "get_funding_milestones_by_funding_research_relation_and_status",
    "params": [
        "funding_research_relation_id",
        "status"
    ]
},
{
    "api": "database_api",
    "method": "get_funding_milestones_by_research",
    "params": [
        "funding_research_relation_id"
    ]
},

// Milestone Report
{
    "api": "database_api",
    "method": "get_milestone_reports_by_research",
    "params": [
        "research_id"
    ]
},
{
    "api": "database_api",
    "method": "get_milestone_reports_by_grantor",
    "params": [
        "grantor"
    ]
},

// Organization
{
    "api": "database_api",
    "method": "get_organisation",
    "params": [
        "id"
    ]
},
{
    "api": "database_api",
    "method": "get_organisation_by_permlink",
    "params": [
        "permlink"
    ]
},
{
    "api": "database_api",
    "method": "get_organisations",
    "params": [
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
    "method": "get_account_balances_by_owner",
    "params": [
        "owner"
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
    "api": "cr_history_api",
    "method": "get_content_references",
    "params": [
        "research_content_id"
    ]
},
{
    "api": "cr_history_api",
    "method": "get_contents_refer_to_content",
    "params": [
        "research_content_id"
    ]
}
];