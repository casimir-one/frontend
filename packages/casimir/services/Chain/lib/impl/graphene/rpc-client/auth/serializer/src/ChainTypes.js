"use strict";

var ChainTypes;

module.exports = ChainTypes = {};

ChainTypes.reserved_spaces = {
  relative_protocol_ids: 0,
  protocol_ids: 1,
  implementation_ids: 2
};

ChainTypes.operations = {
  create_account: 0,
  update_account: 1,

  transfer: 2,
  transfer_to_common_tokens: 3,
  withdraw_common_tokens: 4,
  set_withdraw_common_tokens_route: 5,

  witness_update: 6,
  account_witness_vote: 7,
  account_witness_proxy: 8,

  request_account_recovery: 9,
  recover_account: 10,
  change_recovery_account: 11,

  join_research_contract: 12,
  leave_research_contract: 13,
  create_research: 14,
  update_research: 15,
  create_research_content: 16,

  create_research_token_sale: 19,
  contribute_to_token_sale: 20,
  transfer_research_share: 21,

  create_asset: 22,
  issue_asset: 23,
  reserve_asset: 24,

  create_vesting_balance: 25,
  withdraw_vesting_balance: 26,

  create_proposal: 27,
  update_proposal: 28,
  delete_proposal: 29,

  create_research_license: 52,
  create_contract_agreement: 53,
  accept_contract_agreement: 54,
  reject_contract_agreement: 55,

  // virtual operations
  fill_common_tokens_withdraw: 56,
  shutdown_witness: 57,
  hardfork: 58,
  producer_reward: 59
};

//types.hpp
ChainTypes.object_type = {
  "null": 0,
  base: 1
};