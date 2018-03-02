var ChainTypes;

module.exports = ChainTypes = {};

ChainTypes.reserved_spaces = {
    relative_protocol_ids: 0,
    protocol_ids: 1,
    implementation_ids: 2
};

ChainTypes.operations = {
    vote: 0,

    transfer: 1,
    transfer_to_vesting: 2,
    withdraw_vesting: 3,

    account_create: 4,
    account_update: 5,

    witness_update: 6,
    account_witness_vote: 7,
    account_witness_proxy: 8,

    set_withdraw_vesting_route: 9,

    prove_authority: 10,

    request_account_recovery: 11,
    recover_account: 12,
    change_recovery_account: 13,

    escrow_transfer: 14,
    escrow_dispute: 15,
    escrow_release: 16,
    escrow_approve: 17,

    decline_voting_rights: 18,
    delegate_vesting_shares: 19,
    account_create_with_delegation: 20,

    // DEIP native operations
    create_budget: 21,
    create_research_group: 22,
    create_proposal: 23,
    vote_proposal: 24,
    make_research_review: 25,
    contribute_to_token_sale: 26,
    approve_research_group_invite: 27,
    reject_research_group_invite: 28,

    // virtual operations
    author_reward: 29,
    curation_reward: 30,
    fill_vesting_withdraw: 31,
    shutdown_witness: 32,
    hardfork: 33,
    return_vesting_delegation: 34
};

//types.hpp
ChainTypes.object_type = {
    "null": 0,
    base: 1,
};