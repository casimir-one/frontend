module.exports = [{
        "roles": ["active", "owner"],
        "operation": "transfer",
        "params": [
            "from",
            "to",
            "amount",
            "asset_symbol",
            "memo"
        ]
    }, {
        "roles": ["active", "owner"],
        "operation": "withdraw_vesting",
        "params": [
            "account",
            "vesting_shares"
        ]
    }, {
        "roles": ["active", "owner"],
        "operation": "account_create",
        "params": [
            "fee",
            "asset_symbol",
            "creator",
            "new_account_name",
            "owner",
            "active",
            "posting",
            "memo_key",
            "json_metadata"
        ]
    }, {
        "roles": ["active", "owner"],
        "operation": "account_update",
        "params": [
            "account",
            "owner",
            "active",
            "posting",
            "memo_key",
            "json_metadata"
        ]
    }, {
        "roles": ["active", "owner"],
        "operation": "witness_update",
        "params": [
            "owner",
            "url",
            "block_signing_key",
            "props",
            "fee",
            "asset_symbol"
        ]
    }, {
        "roles": ["active", "owner"],
        "operation": "account_witness_vote",
        "params": [
            "account",
            "witness",
            "approve"
        ]
    }, {
        "roles": ["active", "owner"],
        "operation": "account_witness_proxy",
        "params": [
            "account",
            "proxy"
        ]
    }, {
        "roles": ["active", "owner"],
        "operation": "set_withdraw_common_tokens_route",
        "params": [
            "from_account",
            "to_account",
            "percent",
            "auto_common_token"
        ]
    }, {
        "roles": ["active", "owner"],
        "operation": "request_account_recovery",
        "params": [
            "recovery_account",
            "account_to_recover",
            "new_owner_authority",
            "extensions"
        ]
    }, {
        "roles": ["owner"],
        "operation": "recover_account",
        "params": [
            "account_to_recover",
            "new_owner_authority",
            "recent_owner_authority",
            "extensions"
        ]
    }, {
        "roles": ["owner"],
        "operation": "change_recovery_account",
        "params": [
            "account_to_recover",
            "new_recovery_account",
            "extensions"
        ]
    }, {
        "roles": ["active", "owner"],
        "operation": "account_create_with_delegation",
        "params": [
            "fee",
            "delegation",
            "creator",
            "new_account_name",
            "owner",
            "active",
            "posting",
            "memo_key",
            "json_metadata",
            "extensions"
        ]
    },
    // DEIP native operations
    {
        "roles": ["active", "owner"],
        "operation": "create_discipline_supply",
        "params": [
            "owner",
            "balance",
            "asset_symbol",
            "target_discipline",
            "start_block",
            "end_block",
            "is_extendable",
            "content_hash"
        ]
    }, {
        "roles": ["active", "owner"],
        "operation": "create_research_group",
        "params": [
            "creator",
            "name",
            "permlink",
            "description",
            "quorum_percent",
            "proposal_quorums",
            "is_personal",
            "invitees"
        ]
    }, {
        "roles": ["active", "owner"],
        "operation": "create_proposal",
        "params": [
            "creator",
            "research_group_id",
            "data",
            "action",
            "expiration_time"
        ]
    }, {
        "roles": ["active", "owner"],
        "operation": "vote_proposal",
        "params": [
            "voter",
            "proposal_id",
            "research_group_id"
        ]
    }, {
        "roles": ["active", "owner"],
        "operation": "delegate_expertise",
        "params": [
            "sender",
            "receiver",
            "discipline_id"
        ]
    }, {
        "roles": ["active", "owner"],
        "operation": "revoke_expertise_delegation",
        "params": [
            "sender",
            "receiver",
            "discipline_id"
        ]
    }, {
        "roles": ["active", "owner"],
        "operation": "make_review",
        "params": [
            "author",
            "research_content_id",
            "content",
            "is_positive",
            "weight"
        ]
    }, {
        "roles": ["active", "owner"],
        "operation": "contribute_to_token_sale",
        "params": [
            "research_token_sale_id",
            "owner",
            "amount",
            "asset_symbol"
        ]
    }, {
        "roles": ["active", "owner"],
        "operation": "approve_research_group_invite",
        "params": [
            "research_group_invite_id",
            "owner"
        ]
    }, {
        "roles": ["active", "owner"],
        "operation": "reject_research_group_invite",
        "params": [
            "research_group_invite_id",
            "owner"
        ]
    }, {
        "roles": ["active", "owner"],
        "operation": "vote_for_review",
        "params": [
            "voter",
            "review_id",
            "discipline_id",
            "weight"
        ]
    }, {
        "roles": ["active", "owner"],
        "operation": "transfer_research_tokens_to_research_group",
        "params": [
            "research_token_id",
            "research_id",
            "owner",
            "amount" 
        ]
    }, {
        "roles": ["active", "owner"],
        "operation": "set_expertise_tokens",
        "params": [
            "owner",
            "account_name",
            "disciplines_to_add"
        ]
    }, {
        "roles": ["active", "owner"],
        "operation": "research_update",
        "params": [
            "research_id",
            "title",
            "abstract",
            "permlink",
            "owner"
        ]
    }, {
        "roles": ["active", "owner"],
        "operation": "create_vesting_balance",
        "params": [
            "creator",
            "owner",
            "balance",
            "asset_symbol",            
            "vesting_duration_seconds",
            "vesting_cliff_seconds",
            "period_duration_seconds"
        ]
    }, {
        "roles": ["active", "owner"],
        "operation": "withdraw_vesting_balance",
        "params": [
            "vesting_balance_id",
            "owner",
            "amount",
            "asset_symbol"
        ]
    }, {
        "roles": ["active", "owner"],
        "operation": "transfer_research_tokens",
        "params": [
            "research_id",
            "sender",
            "receiver",
            "amount"
        ]
    }, {
        "roles": ["active", "owner"],
        "operation": "transfer_to_common_tokens",
        "params": [
            "from",
            "to",
            "amount",
            "asset_symbol"
        ]
    }, {
        "roles": ["active", "owner"],
        "operation": "withdraw_common_tokens",
        "params": [
            "account",
            "total_common_tokens_amount"
        ]
    }, {
        "roles": ["active", "owner"],
        "operation": "create_expertise_allocation_proposal",
        "params": [
            "claimer",
            "discipline_id",
            "description"
        ]
    }, {
        "roles": ["active", "owner"],
        "operation": "vote_for_expertise_allocation_proposal",
        "params": [
            "proposal_id",
            "voter",
            "voting_power"
        ]
    }, {
        "roles": ["active", "owner"],
        "operation": "accept_research_token_offer",
        "params": [
            "offer_research_tokens_id",
            "buyer"
        ]
    }, {
        "roles": ["active", "owner"],
        "operation": "reject_research_token_offer",
        "params": [
            "offer_research_tokens_id",
            "buyer"
        ]
    }, {
        "roles": ["active", "owner"],
        "operation": "create_funding_opportunity",
        "params": [
            "funding_opportunity_number",
            "funding_opportunity_title",
            "eligible_applicants",
            "additional_info_of_eligibility",
            "agency_name",
            "description",
            "link_to_additional_info",
            "grantor_contact_info",
            "target_discipline",
            "amount",
            "award_ceiling",
            "award_floor",
            "asset_symbol",
            "owner",
            "officers",
            "min_number_of_positive_reviews",
            "min_number_of_applications",
            "expected_number_of_awards",
            "open_date",
            "close_date",
            "review_committee_id"
        ]
    }, {
        "roles": ["active", "owner"],
        "operation": "create_grant_application",
        "params": [
            "grant_id",
            "research_id",
            "title",
            "creator",
            "total_amount",
            "application_hash",
            "organisation"
        ]
    }, {
        "roles": ["active", "owner"],
        "operation": "make_review_for_application",
        "params": [
            "author",
            "grant_application_id",
            "is_positive",
            "content"
        ]
    }, {
        "roles": ["active", "owner"],
        "operation": "approve_grant_application",
        "params": [
            "grant_application_id",
            "approver"
        ]
    }, {
        "roles": ["active", "owner"],
        "operation": "reject_grant_application",
        "params": [
            "grant_application_id",
            "rejecter"
        ]
    }, {
        "roles": ["active", "owner"],
        "operation": "create_funding",
        "params": [
            "funding_opportunity_id",
            "creator",
            "researches",
            "amount",
            "asset_symbol"
        ]
    }, {
        "roles": ["active", "owner"],
        "operation": "approve_funding",
        "params": [
            "funding_id",
            "approver"
        ]
    }, {
        "roles": ["active", "owner"],
        "operation": "reject_funding",
        "params": [
            "funding_id",
            "rejecter"
        ]
    }, {
        "roles": ["active", "owner"],
        "operation": "create_funding_withdrawal_request",
        "params": [
            "funding_research_relation_id",
            "research_group_id",
            "research_id",
            "organisation_id",
            "requester",
            "purpose",
            "amount",
            "asset_symbol",
            "description",
            "attachment"
        ]
    }, {
        "roles": ["active", "owner"],
        "operation": "approve_funding_withdrawal_request",
        "params": [
            "funding_withdrawal_request_id",
            "approver"
        
        ]
    }, {
        "roles": ["active", "owner"],
        "operation": "reject_funding_withdrawal_request",
        "params": [
            "funding_withdrawal_request_id",
            "rejecter"
        ]
    }, {
        "roles": ["active", "owner"],
        "operation": "approve_funding_milestone",
        "params": [
            "funding_milestone_id",
            "approver"
        ]
    }, {
        "roles": ["active", "owner"],
        "operation": "reject_funding_milestone",
        "params": [
            "funding_milestone_id",
            "rejecter"
        ]
    }, {
        "roles": ["active", "owner"],
        "operation": "create_organisation",
        "params": [
            "creator",
            "name",
            "permlink"
        ]
    }, {
        "roles": ["active", "owner"],
        "operation": "certify_funding_withdrawal_request",
        "params": [
            "certifier",
            "funding_withdrawal_request_id"
        ]
    }, {
        "roles": ["active", "owner"],
        "operation": "create_asset",
        "params": [
            "issuer",
            "asset_symbol",
            "name",
            "description"
        ]
    }, {
        "roles": ["active", "owner"],
        "operation": "issue_asset_backed_tokens",
        "params": [
            "issuer",
            "asset_id",
            "amount"
        ]
    },
    // virtual operations
    {
        "roles": ["active", "owner"],
        "operation": "fill_common_tokens_withdraw",
        "params": [
            "from_account",
            "to_account",
            "withdrawn",
            "deposited"
        ]
    }
];