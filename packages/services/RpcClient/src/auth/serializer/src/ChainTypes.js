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
    placeholder1: 13,
    create_research_group: 14,
    create_proposal: 15,
    vote_proposal: 16,
    make_review: 17,
    contribute_to_token_sale: 18,
    approve_research_group_invite: 19,
    reject_research_group_invite: 20,
    transfer_research_tokens_to_research_group: 21,
    placeholder2: 22,
    research_update: 23,
    create_vesting_balance: 24,
    withdraw_vesting_balance: 25,
    transfer_research_tokens: 26,
    delegate_expertise: 27,
    revoke_expertise_delegation: 28,
    create_expertise_allocation_proposal: 29,
    vote_for_expertise_allocation_proposal: 30,
    accept_research_token_offer: 31,
    reject_research_token_offer: 32,
    create_grant: 33,
    create_grant_application: 34,
    make_review_for_application: 35,
    approve_grant_application: 36,
    reject_grant_application: 37,
    create_asset: 38,
    issue_asset: 39,
    reserve_asset: 40,
    create_award: 41,
    
    /* === The 2nd nsf demo  ===
    create_funding_opportunity,
    create_funding,
    approve_funding,
    reject_funding,
    create_funding_withdrawal_request,
    approve_funding_withdrawal_request,
    reject_funding_withdrawal_request,
    approve_funding_milestone,
    reject_funding_milestone,
    create_organisation,
    certify_funding_withdrawal_request,
    legacy_create_asset,
    legacy_issue_asset_backed_tokens,
    pay_funding_withdrawal_request,
    */

    /* === IP Ledger module ===
    add_member_to_research,
    exclude_member_from_research,
    create_nda_contract,
    sign_nda_contract,
    decline_nda_contract,
    close_nda_contract,
    create_request_by_nda_contract,
    fulfill_request_by_nda_contract,
    create_subscription,
    adjust_subscription_extra_quota,
    update_subscription,
    */

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