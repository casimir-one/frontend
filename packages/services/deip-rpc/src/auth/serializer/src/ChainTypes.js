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

    account_create: 4,
    account_update: 5,

    witness_update: 6,
    account_witness_vote: 7,
    account_witness_proxy: 8,

    set_withdraw_common_tokens_route: 9,

    request_account_recovery: 10,
    recover_account: 11,
    change_recovery_account: 12,

    // DEIP native operations
    create_grant: 13,
    create_research_group: 14,
    create_proposal: 15,
    vote_proposal: 16,
    make_review: 17,
    contribute_to_token_sale: 18,
    approve_research_group_invite: 19,
    reject_research_group_invite: 20,
    transfer_research_tokens_to_research_group: 21,
    add_expertise_tokens: 22,
    research_update: 23,
    deposit_to_vesting_contract: 24,
    withdraw_from_vesting_contract: 25,
    transfer_research_tokens: 26,
    delegate_expertise: 27,
    revoke_expertise_delegation: 28,
    
    // virtual operations
    fill_common_tokens_withdraw: 29,
    shutdown_witness: 30,
    hardfork: 31,
    producer_reward_operation: 32
};

//types.hpp
ChainTypes.object_type = {
    "null": 0,
    base: 1,
};