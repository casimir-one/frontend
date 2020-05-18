var ChainTypes;

module.exports = ChainTypes = {};

ChainTypes.reserved_spaces = {
    relative_protocol_ids: 0,
    protocol_ids: 1,
    implementation_ids: 2
};

ChainTypes.operations = {
    vote_for_review: 0,

    transfer: 1,
    transfer_to_common_tokens: 2,
    withdraw_common_tokens: 3,

    create_account: 4,
    update_account: 5,

    witness_update: 6,
    account_witness_vote: 7,
    account_witness_proxy: 8,

    set_withdraw_common_tokens_route: 9,

    request_account_recovery: 10,
    recover_account: 11,
    change_recovery_account: 12,

    // DEIP native operations
    placeholder1: 13,
    delete_proposal: 14,
    create_proposal: 15,
    update_proposal: 16,
    make_review: 17,
    contribute_to_token_sale: 18,
    placeholder2: 19,
    placeholder3: 20,
    placeholder9: 21,
    placeholder4: 22,
    placeholder5: 23,
    create_vesting_balance: 24,
    withdraw_vesting_balance: 25,
    transfer_research_share: 26,
    delegate_expertise: 27,
    revoke_expertise_delegation: 28,
    create_expertise_allocation_proposal: 29,
    vote_for_expertise_allocation_proposal: 30,
    placeholder6: 31,
    placeholder7: 32,
    create_grant: 33,
    create_grant_application: 34,
    make_review_for_application: 35,
    approve_grant_application: 36,
    reject_grant_application: 37,
    create_asset: 38,
    issue_asset: 39,
    reserve_asset: 40,
    create_award: 41,
    approve_award: 42,
    reject_award: 43,
    create_award_withdrawal_request: 44,
    certify_award_withdrawal_request: 45,
    approve_award_withdrawal_request: 46,
    reject_award_withdrawal_request: 47,
    pay_award_withdrawal_request: 48,
    
    join_research_group_membership: 49,
    left_research_group_membership: 50,
    create_research: 51,
    create_research_content: 52,
    create_research_token_sale: 53,
    placeholder8: 54,
    update_research: 55,
  
    // virtual operations
    fill_common_tokens_withdraw: 42,
    shutdown_witness: 43,
    hardfork: 44,
    producer_reward: 45
};

//types.hpp
ChainTypes.object_type = {
    "null": 0,
    base: 1,
};