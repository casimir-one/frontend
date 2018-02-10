var ChainTypes;

module.exports = ChainTypes = {};

ChainTypes.reserved_spaces = {
  relative_protocol_ids: 0,
  protocol_ids: 1,
  implementation_ids: 2
};

ChainTypes.operations = {
  vote: 0,
  comment: 1,

  transfer: 2,
  transfer_to_vesting: 3,
  withdraw_vesting: 4,

  account_create: 5,
  account_update: 6,

  witness_update: 7,
  account_witness_vote: 8,
  account_witness_proxy: 9,

  custom: 10,

  delete_comment: 11,
  custom_json: 12,
  comment_options: 13,
  set_withdraw_vesting_route: 14,

  prove_authority: 15,

  request_account_recovery: 16,
  recover_account: 17,
  change_recovery_account: 18,

  escrow_transfer: 19,
  escrow_dispute: 20,
  escrow_release: 21,
  escrow_approve: 22,

  custom_binary: 23,
  decline_voting_rights: 24,
  delegate_vesting_shares: 25,
  account_create_with_delegation: 26,

  // DEIP native operations
  create_budget: 27,
  create_research_group: 28,
  create_proposal: 29,
  vote_proposal: 30,
  make_research_review: 31,

  // virtual operations
  author_reward: 32,
  curation_reward: 33,
  comment_reward: 34,
  fill_vesting_withdraw: 35,
  shutdown_witness: 36,
  hardfork: 37,
  comment_payout_update: 38,
  return_vesting_delegation: 39,
  comment_benefactor_reward: 40
};

//types.hpp
ChainTypes.object_type = {
  "null": 0,
  base: 1,
};
