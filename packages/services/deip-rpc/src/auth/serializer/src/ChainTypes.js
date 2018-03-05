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

    escrow_transfer: 13,
    escrow_dispute: 14,
    escrow_release: 15,
    escrow_approve: 16,

    decline_voting_rights: 17,
    delegate_vesting_shares: 18,
    account_create_with_delegation: 19,

    // DEIP native operations
    create_grant: 20,
    create_research_group: 21,
    create_proposal: 22,
    vote_proposal: 23,
    make_research_review: 24,
    contribute_to_token_sale: 25,
    approve_research_group_invite: 26,
    reject_research_group_invite: 27,

    // virtual operations
    author_reward: 28,
    curation_reward: 29,
    fill_vesting_withdraw: 30,
    shutdown_witness: 31,
    hardfork: 32,
    return_vesting_delegation: 33
};

//types.hpp
ChainTypes.object_type = {
    "null": 0,
    base: 1,
};