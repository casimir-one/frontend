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

    delete_comment: 10,
    comment_options: 11,
    set_withdraw_vesting_route: 12,

    prove_authority: 13,

    request_account_recovery: 14,
    recover_account: 15,
    change_recovery_account: 16,

    escrow_transfer: 17,
    escrow_dispute: 18,
    escrow_release: 19,
    escrow_approve: 20,

    decline_voting_rights: 21,
    delegate_vesting_shares: 22,
    account_create_with_delegation: 23,

    // DEIP native operations
    create_budget: 24,
    create_research_group: 25,
    create_proposal: 26,
    vote_proposal: 27,
    make_research_review: 28,

    // virtual operations
    author_reward: 29,
    curation_reward: 30,
    comment_reward: 31,
    fill_vesting_withdraw: 32,
    shutdown_witness: 33,
    hardfork: 34,
    comment_payout_update: 35,
    return_vesting_delegation: 36,
    comment_benefactor_reward: 37
};

//types.hpp
ChainTypes.object_type = {
    "null": 0,
    base: 1,
};