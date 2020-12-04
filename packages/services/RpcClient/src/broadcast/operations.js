module.exports = [{
  "roles": ["active", "owner"],
  "operation": "transfer",
  "params": [
    "from",
    "to",
    "amount",
    "memo",
    "extensions"
  ]
}, {
  "roles": ["active", "owner"],
  "operation": "withdraw_vesting",
  "params": [
    "account",
    "vesting_shares",
    "extensions"
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
    "active_overrides",
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
    "active_overrides",
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
    "fee",
    "extensions"
  ]
}, {
  "roles": ["active", "owner"],
  "operation": "account_witness_vote",
  "params": [
    "account",
    "witness",
    "approve",
    "extensions"
  ]
}, {
  "roles": ["active", "owner"],
  "operation": "account_witness_proxy",
  "params": [
    "account",
    "proxy",
    "extensions"
  ]
}, {
  "roles": ["active", "owner"],
  "operation": "set_withdraw_common_tokens_route",
  "params": [
    "from_account",
    "to_account",
    "percent",
    "auto_common_token",
    "extensions"
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
  "operation": "leave_research_group_membership",
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
    "description",
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
    "description",
    "content",
    "authors",
    "references",
    "extensions"
  ]
}, {
  "roles": ["active", "owner"],
  "operation": "create_research_token_sale",
  "params": [
    "external_id",
    "research_group",
    "research_external_id",
    "start_time",
    "end_time",
    "security_tokens_on_sale",
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
    "description",
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
    "discipline_id",
    "extensions"
  ]
}, {
  "roles": ["active", "owner"],
  "operation": "revoke_expertise_delegation",
  "params": [
    "sender",
    "receiver",
    "discipline_id",
    "extensions"
  ]
}, {
  "roles": ["active", "owner"],
  "operation": "create_review",
  "params": [
    "external_id",
    "author",
    "research_content_external_id",
    "content",
    "weight",
    "assessment_model",
    "disciplines",
    "extensions"
  ]
}, {
  "roles": ["active", "owner"],
  "operation": "contribute_to_token_sale",
  "params": [
    "token_sale_external_id",
    "contributor",
    "amount",
    "extensions"
  ]
}, {
  "roles": ["active", "owner"],
  "operation": "vote_for_review",
  "params": [
    "external_id",
    "voter",
    "review_external_id",
    "discipline_external_id",
    "weight",
    "extensions"
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
    "period_duration_seconds",
    "extensions"
  ]
}, {
  "roles": ["active", "owner"],
  "operation": "withdraw_vesting_balance",
  "params": [
    "vesting_balance_id",
    "owner",
    "amount",
    "extensions"
  ]
}, {
  "roles": ["active", "owner"],
  "operation": "transfer_research_share",
  "params": [
    "research_external_id",
    "sender",
    "receiver",
    "share",
    "extensions"
  ]
}, {
  "roles": ["active", "owner"],
  "operation": "transfer_to_common_tokens",
  "params": [
    "from",
    "to",
    "amount",
    "extensions"
  ]
}, {
  "roles": ["active", "owner"],
  "operation": "withdraw_common_tokens",
  "params": [
    "account",
    "total_common_tokens_amount",
    "extensions"
  ]
}, {
  "roles": ["active", "owner"],
  "operation": "create_expertise_allocation_proposal",
  "params": [
    "claimer",
    "discipline_id",
    "description",
    "extensions"
  ]
}, {
  "roles": ["active", "owner"],
  "operation": "vote_for_expertise_allocation_proposal",
  "params": [
    "proposal_id",
    "voter",
    "voting_power",
    "extensions"
  ]
}, {
  "roles": ["active", "owner"],
  "operation": "create_grant",
  "params": [
    "external_id",
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
    "application_hash",
    "extensions"
  ]
}, {
  "roles": ["active", "owner"],
  "operation": "create_review_for_application",
  "params": [
    "author",
    "grant_application_id",
    "is_positive",
    "content",
    "weight",
    "extensions"
  ]
}, {
  "roles": ["active", "owner"],
  "operation": "approve_grant_application",
  "params": [
    "grant_application_id",
    "approver",
    "extensions"
  ]
}, {
  "roles": ["active", "owner"],
  "operation": "reject_grant_application",
  "params": [
    "grant_application_id",
    "rejector",
    "extensions"
  ]
}, {
  "roles": ["active", "owner"],
  "operation": "create_award",
  "params": [
    "award_number",
    "funding_opportunity_number",
    "award",
    "awardee",
    "research_external_id",
    "university_external_id",
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
    "approver",
    "extensions"
  ]
}, {
  "roles": ["active", "owner"],
  "operation": "reject_award",
  "params": [
    "award_number",
    "rejector",
    "extensions"
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
    "attachment",
    "extensions"
  ]
}, {
  "roles": ["active", "owner"],
  "operation": "certify_award_withdrawal_request",
  "params": [
    "payment_number",
    "award_number",
    "subaward_number",
    "certifier",
    "extensions"
  ]
}, {
  "roles": ["active", "owner"],
  "operation": "approve_award_withdrawal_request",
  "params": [
    "payment_number",
    "award_number",
    "subaward_number",
    "approver",
    "extensions"
  ]
}, {
  "roles": ["active", "owner"],
  "operation": "reject_award_withdrawal_request",
  "params": [
    "payment_number",
    "award_number",
    "subaward_number",
    "rejector",
    "extensions"
  ]
}, {
  "roles": ["active", "owner"],
  "operation": "pay_award_withdrawal_request",
  "params": [
    "payment_number",
    "award_number",
    "subaward_number",
    "payer",
    "extensions"
  ]
}, {
  "roles": ["active", "owner"],
  "operation": "create_asset",
  "params": [
    "issuer",
    "symbol",
    "precision",
    "description",
    "max_supply",
    "traits",
    "extensions"
  ]
}, {
  "roles": ["active", "owner"],
  "operation": "issue_asset",
  "params": [
    "issuer",
    "amount",
    "recipient",
    "memo",
    "extensions"
  ]
}, {
  "roles": ["active", "owner"],
  "operation": "reserve_asset",
  "params": [
    "owner",
    "amount",
    "extensions"
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
    "end_date",
    "extensions"
  ]
}, {
  "roles": ["active", "owner"],
  "operation": "sign_nda_contract",
  "params": [
    "contract_id",
    "contract_signer",
    "signature",
    "extensions"
  ]
}, {
  "roles": ["active", "owner"],
  "operation": "decline_nda_contract",
  "params": [
    "contract_id",
    "decliner",
    "extensions"
  ]
}, {
  "roles": ["active", "owner"],
  "operation": "close_nda_contract",
  "params": [
    "contract_id",
    "closer",
    "extensions"
  ]
}, {
  "roles": ["active", "owner"],
  "operation": "create_request_by_nda_contract",
  "params": [
    "requester",
    "encrypted_payload_hash",
    "encrypted_payload_iv",
    "contract_id",
    "extensions"
  ]
}, {
  "roles": ["active", "owner"],
  "operation": "fulfill_request_by_nda_contract",
  "params": [
    "grantor",
    "encrypted_payload_encryption_key",
    "proof_of_encrypted_payload_encryption_key",
    "request_id",
    "extensions"
  ]
}, {
  "roles": ["active", "owner"],
  "operation": "create_assessment",
  "params": [
    "external_id",
    "creator",
    "stages",
    "extensions"
  ]
}, {
    "roles": ["active", "owner"],
    "operation": "create_research_license",
    "params": [
      "external_id",
      "research_external_id",
      "licenser",
      "licensee",
      "license_conditions",
      "extensions"
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