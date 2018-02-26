module.exports = [{
        "roles": ["posting", "active", "owner"],
        "operation": "vote",
        "params": [
            "voter",
            "discipline_id",
            "weight",
            "research_id",
            "research_content_id"
        ]
    }, {
        "roles": ["posting", "active", "owner"],
        "operation": "comment",
        "params": [
            "parent_author",
            "parent_permlink",
            "author", "permlink",
            "title",
            "body",
            "json_metadata"
        ]
    }, {
        "roles": ["active", "owner"],
        "operation": "transfer",
        "params": [
            "from",
            "to",
            "amount",
            "memo"
        ]
    }, {
        "roles": ["active", "owner"],
        "operation": "transfer_to_vesting",
        "params": [
            "from",
            "to",
            "amount"
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
            "fee"
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
    },
    {
        "roles": ["posting", "active", "owner"],
        "operation": "delete_comment",
        "params": [
            "author",
            "permlink"
        ]
    }, {
        "roles": ["posting", "active", "owner"],
        "operation": "comment_options",
        "params": [
            "author",
            "permlink",
            "max_accepted_payout",
            "percent_steem_dollars",
            "allow_votes",
            "allow_curation_rewards",
            "extensions"
        ]
    }, {
        "roles": ["active", "owner"],
        "operation": "set_withdraw_vesting_route",
        "params": [
            "from_account",
            "to_account",
            "percent",
            "auto_vest"
        ]
    }, {
        "roles": ["active", "owner"],
        "operation": "prove_authority",
        "params": [
            "challenged",
            "require_owner"
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
        "operation": "escrow_transfer",
        "params": [
            "from",
            "to",
            "agent",
            "escrow_id",
            "sbd_amount",
            "steem_amount",
            "fee",
            "ratification_deadline",
            "escrow_expiration",
            "json_meta"
        ]
    }, {
        "roles": ["active", "owner"],
        "operation": "escrow_dispute",
        "params": [
            "from",
            "to",
            "agent",
            "who",
            "escrow_id"
        ]
    }, {
        "roles": ["active", "owner"],
        "operation": "escrow_release",
        "params": [
            "from",
            "to",
            "agent",
            "who",
            "receiver",
            "escrow_id",
            "sbd_amount",
            "steem_amount"
        ]
    }, {
        "roles": ["active", "owner"],
        "operation": "escrow_approve",
        "params": [
            "from",
            "to",
            "agent",
            "who",
            "escrow_id",
            "approve"
        ]
    }, {
        "roles": ["owner"],
        "operation": "decline_voting_rights",
        "params": [
            "account",
            "decline"
        ]
    }, {
        "roles": ["active", "owner"],
        "operation": "delegate_vesting_shares",
        "params": [
            "delegator",
            "delegatee",
            "vesting_shares"
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
        "operation": "create_budget",
        "params": [
            "owner",
            "balance",
            "target_discipline",
            "start_block",
            "end_block"
        ]
    }, {
        "roles": ["active", "owner"],
        "operation": "create_research_group",
        "params": [
            "creator",
            "permlink",
            "desciption",
            "quorum_percent",
            "tokens_amount"
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
        "operation": "make_research_review",
        "params": [
            "author",
            "research_id",
            "content",
            "research_references",
            "research_external_references"
        ]
    }, {
        "roles": ["active", "owner"],
        "operation": "contribute_to_token_sale",
        "params": [
            "research_token_sale_id",
            "owner",
            "amount"
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
    },
    // virtual operations
    {
        "roles": ["posting", "active", "owner"],
        "operation": "comment_reward",
        "params": [
            "author",
            "permlink",
            "payout"
        ]
    }, {
        "roles": ["active", "owner"],
        "operation": "fill_vesting_withdraw",
        "params": [
            "from_account",
            "to_account",
            "withdrawn",
            "deposited"
        ]
    }
];