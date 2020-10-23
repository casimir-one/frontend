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

  join_research_group_membership: 12,
  leave_research_group_membership: 13,
  create_research: 14,
  update_research: 15,
  create_research_content: 16,

  create_review: 17,
  vote_for_review: 18,

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

  create_expertise_allocation_proposal: 30,
  vote_for_expertise_allocation_proposal: 31,

  create_grant: 32,
  create_grant_application: 33,
  create_review_for_application: 34,
  approve_grant_application: 35,
  reject_grant_application: 36,
  create_award: 37,
  approve_award: 38,
  reject_award: 39,
  create_award_withdrawal_request: 40,
  certify_award_withdrawal_request: 41,
  approve_award_withdrawal_request: 42,
  reject_award_withdrawal_request: 43,
  pay_award_withdrawal_request: 44,

  create_nda_contract: 45,
  sign_nda_contract: 46,
  decline_nda_contract: 47,
  close_nda_contract: 48,
  create_request_by_nda_contract: 49,
  fulfill_request_by_nda_contract: 50,

  create_assessment: 51,
  create_security_token: 52,
  transfer_security_token: 53,
  create_research_license: 54,

  // virtual operations
  fill_common_tokens_withdraw: 55,
  shutdown_witness: 56,
  hardfork: 57,
  producer_reward: 58
};

//types.hpp
ChainTypes.object_type = {
  "null": 0,
  base: 1,
};