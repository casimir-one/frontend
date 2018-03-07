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

    request_account_recovery: 10,
    recover_account: 11,
    change_recovery_account: 12,

    delegate_vesting_shares: 13,
    account_create_with_delegation: 14,

    // DEIP native operations
    create_grant: 15,
    create_research_group: 16,
    create_proposal: 17,
    vote_proposal: 18,
    make_research_review: 19,
    contribute_to_token_sale: 20,
    approve_research_group_invite: 21,
    reject_research_group_invite: 22,

    // virtual operations
    author_reward: 23,
    curation_reward: 24,
    fill_vesting_withdraw: 25,
    shutdown_witness: 26,
    hardfork: 27,
    return_vesting_delegation: 28
};

//types.hpp
ChainTypes.object_type = {
    "null": 0,
    base: 1,
};