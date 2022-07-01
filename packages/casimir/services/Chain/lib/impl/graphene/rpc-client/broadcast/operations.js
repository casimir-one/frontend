"use strict";

module.exports = [{
  "roles": ["active", "owner"],
  "operation": "transfer",
  "params": ["from", "to", "amount", "memo", "extensions"]
}, {
  "roles": ["active", "owner"],
  "operation": "withdraw_vesting",
  "params": ["account", "vesting_shares", "extensions"]
}, {
  "roles": ["active", "owner"],
  "operation": "create_account",
  "params": ["fee", "creator", "new_account_name", "owner", "active", "active_overrides", "memo_key", "json_metadata", "traits", "extensions"]
}, {
  "roles": ["active", "owner"],
  "operation": "update_account",
  "params": ["account", "owner", "active", "active_overrides", "memo_key", "json_metadata", "traits", "update_extensions"]
}, {
  "roles": ["active", "owner"],
  "operation": "witness_update",
  "params": ["owner", "url", "block_signing_key", "props", "fee", "extensions"]
}, {
  "roles": ["active", "owner"],
  "operation": "account_witness_vote",
  "params": ["account", "witness", "approve", "extensions"]
}, {
  "roles": ["active", "owner"],
  "operation": "account_witness_proxy",
  "params": ["account", "proxy", "extensions"]
}, {
  "roles": ["active", "owner"],
  "operation": "set_withdraw_common_tokens_route",
  "params": ["from_account", "to_account", "percent", "auto_common_token", "extensions"]
}, {
  "roles": ["active", "owner"],
  "operation": "request_account_recovery",
  "params": ["recovery_account", "account_to_recover", "new_owner_authority", "extensions"]
}, {
  "roles": ["owner"],
  "operation": "recover_account",
  "params": ["account_to_recover", "new_owner_authority", "recent_owner_authority", "extensions"]
}, {
  "roles": ["owner"],
  "operation": "change_recovery_account",
  "params": ["account_to_recover", "new_recovery_account", "extensions"]
}, {
  "roles": ["active", "owner"],
  "operation": "account_create_with_delegation",
  "params": ["fee", "delegation", "creator", "new_account_name", "owner", "active", "memo_key", "json_metadata", "extensions"]
}, {
  "roles": ["active", "owner"],
  "operation": "delete_proposal",
  "params": ["external_id", "account", "authority", "extensions"]
}, {
  "roles": ["active", "owner"],
  "operation": "create_proposal",
  "params": ["external_id", "creator", "proposed_ops", "expiration_time", "review_period_seconds", "extensions"]
}, {
  "roles": ["active", "owner"],
  "operation": "update_proposal",
  "params": ["external_id", "active_approvals_to_add", "active_approvals_to_remove", "owner_approvals_to_add", "owner_approvals_to_remove", "key_approvals_to_add", "key_approvals_to_remove", "extensions"]
}, {
  "roles": ["active", "owner"],
  "operation": "join_research_contract",
  "params": ["member", "research_group", "reward_share", "researches", "extensions"]
}, {
  "roles": ["active", "owner"],
  "operation": "leave_research_contract",
  "params": ["member", "research_group", "is_exclusion", "extensions"]
}, {
  "roles": ["active", "owner"],
  "operation": "create_research_content",
  "params": ["external_id", "research_external_id", "research_group", "type", "description", "content", "authors", "references", "extensions"]
}, {
  "roles": ["active", "owner"],
  "operation": "create_research_token_sale",
  "params": ["external_id", "research_group", "research_external_id", "start_time", "end_time", "security_tokens_on_sale", "soft_cap", "hard_cap", "extensions"]
}, {
  "roles": ["active", "owner"],
  "operation": "contribute_to_token_sale",
  "params": ["token_sale_external_id", "contributor", "amount", "extensions"]
}, {
  "roles": ["active", "owner"],
  "operation": "create_vesting_balance",
  "params": ["creator", "owner", "balance", "vesting_duration_seconds", "vesting_cliff_seconds", "period_duration_seconds", "extensions"]
}, {
  "roles": ["active", "owner"],
  "operation": "withdraw_vesting_balance",
  "params": ["vesting_balance_id", "owner", "amount", "extensions"]
}, {
  "roles": ["active", "owner"],
  "operation": "transfer_research_share",
  "params": ["research_external_id", "sender", "receiver", "share", "extensions"]
}, {
  "roles": ["active", "owner"],
  "operation": "transfer_to_common_tokens",
  "params": ["from", "to", "amount", "extensions"]
}, {
  "roles": ["active", "owner"],
  "operation": "withdraw_common_tokens",
  "params": ["account", "total_common_tokens_amount", "extensions"]
}, {
  "roles": ["active", "owner"],
  "operation": "create_asset",
  "params": ["issuer", "symbol", "precision", "description", "max_supply", "traits", "extensions"]
}, {
  "roles": ["active", "owner"],
  "operation": "issue_asset",
  "params": ["issuer", "amount", "recipient", "memo", "extensions"]
}, {
  "roles": ["active", "owner"],
  "operation": "reserve_asset",
  "params": ["owner", "amount", "extensions"]
}, {
  "roles": ["active", "owner"],
  "operation": "create_research_license",
  "params": ["external_id", "research_external_id", "licenser", "licensee", "license_conditions", "extensions"]
}, {
  "roles": ["active", "owner"],
  "operation": "create_contract_agreement",
  "params": ["external_id", "creator", "parties", "hash", "start_time", "end_time", "terms", "extensions"]
}, {
  "roles": ["active", "owner"],
  "operation": "accept_contract_agreement",
  "params": ["external_id", "party", "extensions"]
}, {
  "roles": ["active", "owner"],
  "operation": "reject_contract_agreement",
  "params": ["external_id", "party", "extensions"]
},
// virtual operations
{
  "roles": ["active", "owner"],
  "operation": "fill_common_tokens_withdraw",
  "params": ["from_account", "to_account", "withdrawn", "deposited"]
}];