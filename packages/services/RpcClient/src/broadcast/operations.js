module.exports = [{
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
    "operation": "withdraw_vesting",
    "params": [
        "account",
        "vesting_shares"
    ]
}, {
    "roles": ["active", "owner"],
    "operation": "create_account",
    "params": [
        "fee",
        "creator",
        "new_account_name",
        "owner",
        "active",
        "posting",
        "memo_key",
        "json_metadata",
        "traits",
        "extensions"
    ]
}, {
    "roles": ["active", "owner"],
    "operation": "update_account",
    "params": [
        "account",
        "owner",
        "active",
        "posting",
        "memo_key",
        "json_metadata",
        "traits",
        "extensions"
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
  {
    "roles": ["active", "owner"],
    "operation": "delete_proposal",
    "params": [
      "external_id",
      "account",
      "authority",
      "extensions"
    ]
}, {
    "roles": ["active", "owner"],
    "operation": "create_proposal",
    "params": [
      "external_id",
      "creator",
      "proposed_ops",
      "expiration_time",
      "review_period_seconds",
      "extensions"
    ]
}, {
    "roles": ["active", "owner"],
    "operation": "update_proposal",
    "params": [
      "external_id",
      "posting_approvals_to_add",
      "posting_approvals_to_remove",
      "active_approvals_to_add",
      "active_approvals_to_remove",
      "owner_approvals_to_add",
      "owner_approvals_to_remove",
      "key_approvals_to_add",
      "key_approvals_to_remove",
      "extensions"
    ]
  }, {
    "roles": ["active", "owner"],
    "operation": "join_research_group_membership",
    "params": [
      "member",
      "research_group",
      "reward_share",
      "researches",
      "extensions"
    ]
  }, {
    "roles": ["active", "owner"],
    "operation": "left_research_group_membership",
    "params": [
      "member",
      "research_group",
      "is_exclusion",
      "extensions"
    ]
  }, {
    "roles": ["active", "owner"],
    "operation": "create_research",
    "params": [
      "external_id",
      "research_group",
      "title",
      "abstract",
      "permlink",
      "disciplines",
      "is_private",
      "review_share",
      "compensation_share",
      "members",
      "extensions"
    ]
  }, {
    "roles": ["active", "owner"],
    "operation": "create_research_content",
    "params": [
      "external_id",
      "research_external_id",
      "research_group",
      "type",
      "title",
      "content",
      "permlink",
      "authors",
      "references",
      "foreign_references",
      "extensions"
    ]
  }, {
    "roles": ["active", "owner"],
    "operation": "create_research_token_sale",
    "params": [
      "research_group",
      "research_external_id",
      "start_time",
      "end_time",
      "share",
      "soft_cap",
      "hard_cap",
      "extensions"
    ]
  }, {
    "roles": ["active", "owner"],
    "operation": "update_research",
    "params": [
      "research_group",
      "external_id",
      "title",
      "abstract",
      "permlink",
      "is_private",
      "review_share",
      "compensation_share",
      "members",
      "extensions"
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
        "weight",
        "assessment_model",
        "extensions"
    ]
}, {
    "roles": ["active", "owner"],
    "operation": "contribute_to_token_sale",
    "params": [
        "research_external_id",
        "contributor",
        "amount"
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
    "operation": "create_vesting_balance",
    "params": [
        "creator",
        "owner",
        "balance",
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
        "amount"
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
        "amount"
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
    "operation": "create_grant",
    "params": [
        "grantor",
        "amount",
        "target_disciplines",
        "distribution_model",
        "extensions"
    ]
}, {
    "roles": ["active", "owner"],
    "operation": "create_grant_application",
    "params": [
        "grant_id",
        "research_id",
        "creator",
        "application_hash"
    ]
}, {
    "roles": ["active", "owner"],
    "operation": "make_review_for_application",
    "params": [
        "author",
        "grant_application_id",
        "is_positive",
        "content",
        "weight"
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
        "rejector"
    ]
}, {
    "roles": ["active", "owner"],
    "operation": "create_award",
    "params": [
      "funding_opportunity_number",
      "award_number",
      "award",
      "awardee",
      "research_id",
      "university_id",
      "university_overhead",
      "subawardees",
      "creator",
      "extensions"
    ]
}, {
    "roles": ["active", "owner"],
    "operation": "approve_award",
    "params": [
      "award_number",
      "approver"
    ]
}, {
    "roles": ["active", "owner"],
    "operation": "reject_award",
    "params": [
        "award_number",
        "rejector"
    ]
}, {
    "roles": ["active", "owner"],
    "operation": "create_award_withdrawal_request",
    "params": [
        "payment_number",
        "award_number",
        "subaward_number",
        "requester",
        "amount",
        "description",
        "attachment"
    ]
}, {
    "roles": ["active", "owner"],
    "operation": "certify_award_withdrawal_request",
    "params": [
        "payment_number",
        "award_number",
        "subaward_number",
        "certifier"
    ]
}, {
    "roles": ["active", "owner"],
    "operation": "approve_award_withdrawal_request",
    "params": [
        "payment_number",
        "award_number",
        "subaward_number",
        "approver"
    ]
}, {
    "roles": ["active", "owner"],
    "operation": "reject_award_withdrawal_request",
    "params": [
        "payment_number",
        "award_number",
        "subaward_number",
        "rejector"
    ]
  }, {
    "roles": ["active", "owner"],
    "operation": "pay_award_withdrawal_request",
    "params": [
        "payment_number",
        "award_number",
        "subaward_number",
        "payer"
    ]
}, {
    "roles": ["active", "owner"],
    "operation": "create_asset",
    "params": [
        "issuer",
        "symbol",
        "precision",
        "name",
        "description"
    ]
}, {
    "roles": ["active", "owner"],
    "operation": "issue_asset",
    "params": [
        "issuer",
        "amount"
    ]
  }, {
    "roles": ["active", "owner"],
    "operation": "reserve_asset",
    "params": [
      "owner",
      "amount"
    ]
  }, {
    "roles": ["active", "owner"],
    "operation": "create_nda_contract",
    "params": [
      "contract_creator",
      "party_a",
      "party_a_research_group_id",
      "party_b",
      "party_b_research_group_id",
      "disclosing_party",
      "title",
      "contract_hash",
      "start_date",
      "end_date"
  ]
}, {
    "roles": ["active", "owner"],
    "operation": "sign_nda_contract",
    "params": [
      "contract_id",
      "contract_signer",
      "signature"
  ]
}, {
  "roles": ["active", "owner"],
  "operation": "decline_nda_contract",
  "params": [
    "contract_id",
    "decliner"
  ]
}, {
    "roles": ["active", "owner"],
    "operation": "close_nda_contract",
    "params": [
        "contract_id",
        "closer"
    ]
}, {
  "roles": ["active", "owner"],
  "operation": "create_request_by_nda_contract",
  "params": [
      "requester",
      "encrypted_payload_hash",
      "encrypted_payload_iv",
      "contract_id"
  ]
}, {
  "roles": ["active", "owner"],
  "operation": "fulfill_request_by_nda_contract",
  "params": [
      "grantor",
      "encrypted_payload_encryption_key",
      "proof_of_encrypted_payload_encryption_key",
      "request_id"
  ]
}, {
    "roles": ["active", "owner"],
    "operation": "create_subscription",
    "params": [
        "owner",
        "agent",
        "research_group_id",
        "json_data"
    ]
}, {
    "roles": ["active", "owner"],
    "operation": "adjust_subscription_extra_quota",
    "params": [
        "owner",
        "agent",
        "subscription_id",
        "json_data"
    ]
}, {
    "roles": ["active", "owner"],
    "operation": "update_subscription",
    "params": [
        "owner",
        "agent",
        "subscription_id",
        "json_data"
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