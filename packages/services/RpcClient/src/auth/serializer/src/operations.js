// This file is merge updated from steemd's js_operation_serializer program.
/*

./js_operation_serializer |
sed 's/void/future_extensions/g'|
sed 's/steemit_protocol:://g'|
sed 's/14static_variantIJNS_12fixed_stringINSt3__14pairIyyEEEEEEE/string/g'|
sed 's/steemit_future_extensions/future_extensions/g'|
sed 's/steemit_protocol_//g' > tmp.coffee

*/
// coffee tmp.coffee # fix errors until you see: `ChainTypes is not defined`

/*

   remove these 7 lines from tmp.coffee:

static_variant [
    pow2
    equihash_pow
] = static_variant [
    pow2
    equihash_pow
]

*/

// npm i -g decaffeinate
// decaffeinate tmp.coffee

// Merge tmp.js - See "Generated code follows" below

import types from "./types"
import SerializerImpl from "./serializer"

const {
    //id_type,
    //varint32, uint8, fixed_array, object_id_type, vote_id, address,
    uint8,
    int16,
    int64,
    uint16,
    uint32,
    uint64,
    string,
    string_binary,
    bytes,
    bool,
    array,
    // protocol_id_type,
    static_variant,
    map,
    set,
    public_key,
    time_point_sec,
    optional,
    asset,
    percent
} = types

const future_extensions = types.void
const hardfork_version_vote = types.void
const version = types.void

// Place-holder, their are dependencies on "operation" .. The final list of
// operations is not avialble until the very end of the generated code.
// See: operation.st_operations = ...
const operation = static_variant();
module.exports.operation = operation;

// For module.exports
const Serializer = function (operation_name, serilization_types_object, options = {}) {
    const s = new SerializerImpl(operation_name, serilization_types_object, options);
    return module.exports[operation_name] = s;
}

const placeholder1 = new Serializer("placeholder1", {});
const placeholder2 = new Serializer("placeholder2", {});
const placeholder3 = new Serializer("placeholder3", {});
const placeholder4 = new Serializer("placeholder4", {});
const placeholder5 = new Serializer("placeholder5", {});
const placeholder6 = new Serializer("placeholder6", {});
const placeholder7 = new Serializer("placeholder7", {});
const placeholder8 = new Serializer("placeholder8", {});
const placeholder9 = new Serializer("placeholder9", {});

const subawardee = new Serializer("subawardee", {
    subaward_number: string,
    subaward: asset,
    subawardee: string,
    source: string,
    research_id: int64
});

// Custom-types after Generated code

// ##  Generated code follows
// -------------------------------
/*
When updating generated code (fix closing notation)
Replace:  var operation = static_variant([
with:     operation.st_operations = [

Delete (these are custom types instead):
let public_key = new Serializer( 
    "public_key",
    {key_data: bytes(33)}
);

let asset = new Serializer( 
    "asset",
    {amount: int64,
    symbol: uint64}
);

Replace: authority.prototype.account_authority_map
With: map((string), (uint16))
*/
const signed_transaction = new Serializer("signed_transaction", {
    ref_block_num: uint16,
    ref_block_prefix: uint32,
    expiration: time_point_sec,
    operations: array(operation),
    extensions: set(future_extensions),
    signatures: array(bytes(65))
});

const signed_block = new Serializer("signed_block", {
    previous: bytes(20),
    timestamp: time_point_sec,
    witness: string,
    transaction_merkle_root: bytes(20),
    extensions: set(static_variant([
        future_extensions,
        version,
        hardfork_version_vote
    ])),
    witness_signature: bytes(65),
    transactions: array(signed_transaction)
});

const block_header = new Serializer("block_header", {
    previous: bytes(20),
    timestamp: time_point_sec,
    witness: string,
    transaction_merkle_root: bytes(20),
    extensions: set(static_variant([
        future_extensions,
        version,
        hardfork_version_vote
    ]))
});

const signed_block_header = new Serializer("signed_block_header", {
    previous: bytes(20),
    timestamp: time_point_sec,
    witness: string,
    transaction_merkle_root: bytes(20),
    extensions: set(static_variant([
        future_extensions,
        version,
        hardfork_version_vote
    ])),
    witness_signature: bytes(65)
});

const transfer = new Serializer("transfer", {
    from: string,
    to: string,
    amount: asset,
    memo: string
});

const authority = new Serializer("authority", {
    weight_threshold: uint32,
    account_auths: map((string), (uint16)),
    key_auths: map((public_key), (uint16))
});

const base_account_trait = {
  _v: string
}

const research_group_v1_0_0 = new Serializer("research_group_v1_0_0",
  Object.assign({}, base_account_trait, {
    name: string,
    description: string,
    threshold_overrides: map(uint16, authority)
  })
);

const create_account = new Serializer("create_account", {
    fee: asset,
    creator: string,
    new_account_name: string,
    owner: authority,
    active: authority,
    posting: authority,
    memo_key: public_key,
    json_metadata: optional(string),
    traits: array(static_variant([
      research_group_v1_0_0
    ])),
    extensions: set(future_extensions)
}, { entity_external_id: "new_account_name" });

const update_account = new Serializer("update_account", {
    account: string,
    owner: optional(authority),
    active: optional(authority),
    posting: optional(authority),
    memo_key: optional(public_key),
    json_metadata: optional(string),
    traits: optional(array(static_variant([
      research_group_v1_0_0
    ]))),
    extensions: set(future_extensions)
});

const chain_properties = new Serializer("chain_properties", {
    account_creation_fee: asset,
    maximum_block_size: uint32,
    sbd_interest_rate: uint16
});

const witness_update = new Serializer("witness_update", {
    owner: string,
    url: string,
    block_signing_key: public_key,
    props: chain_properties,
    fee: asset
});

const account_witness_vote = new Serializer("account_witness_vote", {
    account: string,
    witness: string,
    approve: bool
});

const account_witness_proxy = new Serializer("account_witness_proxy", {
    account: string,
    proxy: string
});

const pow = new Serializer("pow", {
    worker: public_key,
    input: bytes(32),
    signature: bytes(65),
    work: bytes(32)
});

const set_withdraw_common_tokens_route = new Serializer("set_withdraw_common_tokens_route", {
    from_account: string,
    to_account: string,
    percent: uint16,
    auto_common_token: bool
});

const challenge_authority = new Serializer("challenge_authority", {
    challenger: string,
    challenged: string,
    require_owner: bool
});

const request_account_recovery = new Serializer("request_account_recovery", {
    recovery_account: string,
    account_to_recover: string,
    new_owner_authority: authority,
    extensions: set(future_extensions)
});

const recover_account = new Serializer("recover_account", {
    account_to_recover: string,
    new_owner_authority: authority,
    recent_owner_authority: authority,
    extensions: set(future_extensions)
});

const change_recovery_account = new Serializer("change_recovery_account", {
    account_to_recover: string,
    new_recovery_account: string,
    extensions: set(future_extensions)
});

// DEIP native operations

const create_research = new Serializer("create_research", {
  external_id: string,
  research_group: string,
  title: string,
  abstract: string,
  disciplines: set(int64),
  is_private:  bool,
  review_share: percent,
  compensation_share: optional(percent),
  members: optional(set(string)),
  extensions: set(future_extensions)
}, { entity_external_id: "external_id" });


const create_research_content = new Serializer("create_research_content", {
  external_id: string,
  research_external_id: string,
  research_group: string,
  type: uint16,
  title: string,
  content: string,
  authors: set(string),
  references: set(string),
  foreign_references: set(string),
  extensions: set(future_extensions)
}, { entity_external_id: "external_id" });

const create_research_token_sale = new Serializer("create_research_token_sale", {
  research_group: string,
  research_external_id: string,
  start_time: time_point_sec,
  end_time: time_point_sec,
  share: percent,
  soft_cap: asset,
  hard_cap: asset,
  extensions: set(future_extensions)
});

const update_research = new Serializer("update_research", {
  research_group: string,
  external_id: string,
  title: optional(string),
  abstract: optional(string),
  is_private: optional(bool),
  review_share: optional(percent),
  compensation_share: optional(percent),
  members: optional(set(string)),
  extensions: set(future_extensions)
});

const join_research_group_membership = new Serializer("join_research_group_membership", {
  member: string,
  research_group: string,
  reward_share: percent,
  researches: optional(set(string)),
  extensions: set(future_extensions)
});

const left_research_group_membership = new Serializer("left_research_group_membership", {
  member: string,
  research_group: string,
  is_exclusion: bool,
  extensions: set(future_extensions)
});

const create_expertise_allocation_proposal = new Serializer("create_expertise_allocation_proposal", {
    claimer: string,
    discipline_id: int64,
    description: string
});

const vote_for_expertise_allocation_proposal = new Serializer("vote_for_expertise_allocation_proposal", {
    proposal_id: int64,
    voter: string,
    voting_power: int64
});


const base_assessment_model = {
  version: string
}

const binary_scoring_assessment_model_v1_0_0 = new Serializer("binary_scoring_assessment_model_v1_0_0",
  Object.assign({}, base_assessment_model, {
    is_positive: bool
  })
);

const multicriteria_scoring_assessment_model_v1_0_0 = new Serializer("multicriteria_scoring_assessment_model_v1_0_0",
  Object.assign({}, base_assessment_model, {
    scores: map((uint16), (uint16))
  })
);

const make_review = new Serializer("make_review", {
    author: string,
    research_content_id: int64,
    content: string,
    weight: uint16,
    assessment_model: static_variant([
      binary_scoring_assessment_model_v1_0_0,
      multicriteria_scoring_assessment_model_v1_0_0
    ]),
    extensions: set(future_extensions)
});

const contribute_to_token_sale = new Serializer("contribute_to_token_sale", {
    research_external_id: string,
    contributor: string,
    amount: asset
});

const vote_for_review = new Serializer("vote_for_review", {
    "voter": string,
    "review_id": int64,
    "discipline_id": int64,
    "weight": int16
});

const create_vesting_balance = new Serializer("create_vesting_balance", {
    "creator": string,
    "owner": string,
    "balance": asset,
    "vesting_duration_seconds": uint32,
    "vesting_cliff_seconds": uint32,
    "period_duration_seconds": uint32
});

const delegate_expertise = new Serializer("delegate_expertise", {
    "sender": string,
    "receiver": string,
    "discipline_id": int64
})

const revoke_expertise_delegation = new Serializer("revoke_expertise_delegation", {
    "sender": string,
    "receiver": string,
    "discipline_id": int64
})

const withdraw_vesting_balance = new Serializer("withdraw_vesting_balance", {
    "vesting_balance_id": int64,
    "owner": string,
    "amount": asset
})

const transfer_research_share = new Serializer("transfer_research_share", {
    research_external_id: string,
    sender: string,
    receiver: string,
    share: percent,
    extensions: set(future_extensions)
})

const transfer_to_common_tokens = new Serializer("transfer_to_common_tokens", {
    "from": string,
    "to": string,
    "amount": asset
});

const withdraw_common_tokens = new Serializer("withdraw_common_tokens", {
    "account": string,
    "total_common_tokens_amount": int64
});

const base_grant_contract_model = {
  version: string
}

const announced_application_window_contract_v1_0_0 = new Serializer("announced_application_window_contract_v1_0_0",
  Object.assign({}, base_grant_contract_model, {
    review_committee_id: int64,
    min_number_of_positive_reviews: uint16,
    min_number_of_applications: uint16,
    max_number_of_research_to_grant: uint16,
    start_date: time_point_sec,
    end_date: time_point_sec,
    additional_info: map((string), (string))
  })
);


const discipline_supply_announcement_contract_v1_0_0 = new Serializer("discipline_supply_announcement_contract_v1_0_0",
  Object.assign({}, base_grant_contract_model, {
    start_time: time_point_sec,
    end_time: time_point_sec,
    is_extendable: bool,
    content_hash: string,
    additional_info: map((string), (string))
  })
);

const funding_opportunity_announcement_contract_v1_0_0 = new Serializer("funding_opportunity_announcement_contract_v1_0_0",
  Object.assign({}, base_grant_contract_model, {
    organization_id: int64,
    review_committee_id: int64,
    treasury_id: int64,
    funding_opportunity_number: string,
    award_ceiling: asset,
    award_floor: asset,
    expected_number_of_awards: uint16,
    open_date: time_point_sec,
    close_date: time_point_sec,
    officers: set(string),
    additional_info: map((string), (string))
  })
);

const create_grant = new Serializer("create_grant", {
    "grantor": string,
    "amount": asset,
    "target_disciplines": set(int64),
    "distribution_model": static_variant([
      announced_application_window_contract_v1_0_0,
      funding_opportunity_announcement_contract_v1_0_0,
      discipline_supply_announcement_contract_v1_0_0
    ]),
    "extensions": set(future_extensions)
});

const create_grant_application = new Serializer("create_grant_application", {
    "grant_id": int64,
    "research_id": int64,
    "creator": string,
    "application_hash": string
});

const make_review_for_application = new Serializer("make_review_for_application", {
    "author": string,
    "grant_application_id": int64,
    "is_positive": bool,
    "content": string,
    "weight": uint16
});

const approve_grant_application = new Serializer("approve_grant_application", {
    "grant_application_id": int64,
    "approver": string
});

const reject_grant_application = new Serializer("reject_grant_application", {
    "grant_application_id": int64,
    "rejector": string
});

const create_award = new Serializer("create_award", {
    "funding_opportunity_number": string,
    "award_number": string,
    "award": asset,
    "awardee": string,
    "research_id": int64,
    "university_id": int64,
    "university_overhead": uint32,
    "subawardees": array(subawardee),
    "creator": string,
    "extensions": set(future_extensions)
});

const approve_award = new Serializer("approve_award", {
    "award_number": string,
    "approver": string
});

const reject_award = new Serializer("reject_award", {
    "award_number": string,
    "rejector": string
});

const create_award_withdrawal_request = new Serializer("create_award_withdrawal_request", {
    "payment_number": string,
    "award_number": string,
    "subaward_number": optional(string),
    "requester": string,
    "amount": asset,
    "description": string,
    "attachment": string
});

const certify_award_withdrawal_request = new Serializer("certify_award_withdrawal_request", {
    "payment_number": string,
    "award_number": string,
    "subaward_number": optional(string),
    "certifier": string
});

const approve_award_withdrawal_request = new Serializer("approve_award_withdrawal_request", {
    "payment_number": string,
    "award_number": string,
    "subaward_number": optional(string),
    "approver": string
});

const reject_award_withdrawal_request = new Serializer("reject_award_withdrawal_request", {
    "payment_number": string,
    "award_number": string,
    "subaward_number": optional(string),
    "rejector": string
});

const pay_award_withdrawal_request = new Serializer("pay_award_withdrawal_request", {
    "payment_number": string,
    "award_number": string,
    "subaward_number": optional(string),
    "payer": string
});

const create_asset = new Serializer("create_asset", {
    "issuer": string,
    "symbol": string,
    "precision": uint8,
    "name": string,
    "description": string
});

const issue_asset = new Serializer("issue_asset", {
    "issuer": string,
    "amount": asset
});

const reserve_asset = new Serializer("reserve_asset", {
    "owner": string,
    "amount": asset
});

const create_nda_contract = new Serializer("create_nda_contract", {
  contract_creator: string,
  party_a: string,
  party_a_research_group_id: int64,
  party_b: string,
  party_b_research_group_id: int64,
  disclosing_party: set(string),
  title: string,
  contract_hash: string,
  start_date: optional(time_point_sec),
  end_date: time_point_sec
});

const sign_nda_contract = new Serializer("sign_nda_contract", {
  contract_id: int64,
  contract_signer: string,
  signature: string
});

const decline_nda_contract = new Serializer("decline_nda_contract", {
  contract_id: int64,
  decliner: string
});

const close_nda_contract = new Serializer("close_nda_contract", {
  contract_id: int64,
  closer: string
});

const create_request_by_nda_contract = new Serializer("create_request_by_nda_contract", {
  requester: string,
  encrypted_payload_hash: string,
  encrypted_payload_iv: string,
  contract_id: int64
});

const fulfill_request_by_nda_contract = new Serializer("fulfill_request_by_nda_contract", {
  grantor: string,
  encrypted_payload_encryption_key: string,
  proof_of_encrypted_payload_encryption_key: string,
  request_id: int64
});


// virtual operations

const fill_common_tokens_withdraw = new Serializer("fill_common_tokens_withdraw", {
    from_account: string,
    to_account: string,
    withdrawn: asset,
    deposited: asset
});

const create_subscription = new Serializer("create_subscription", {
    owner: string,
    agent: string,
    research_group_id: optional(int64),
    json_data: string
});

const adjust_subscription_extra_quota = new Serializer("adjust_subscription_extra_quota", {
    owner: string,
    agent: string,
    subscription_id: int64,
    json_data: string
});

const update_subscription = new Serializer("update_subscription", {
    owner: string,
    agent: string,
    subscription_id: int64,
    json_data: string
});

const shutdown_witness = new Serializer("shutdown_witness", {
    owner: string
});

const hardfork = new Serializer("hardfork", {
    hardfork_id: uint32
});

const producer_reward = new Serializer("producer_reward", {
    producer: string,
    common_tokens_amount: uint32
});

const op_wrapper = new Serializer("op_wrapper", { op: operation }, { nosort: true });

const create_proposal = new Serializer("create_proposal", {
  external_id: string,
  creator: string,
  proposed_ops: array(op_wrapper),
  expiration_time: time_point_sec,
  review_period_seconds: optional(uint32),
  extensions: set(future_extensions)
}, { entity_external_id: "external_id" });

const update_proposal = new Serializer("update_proposal", {
  external_id: string,
  posting_approvals_to_add: set(string),
  posting_approvals_to_remove: set(string),
  active_approvals_to_add: set(string),
  active_approvals_to_remove: set(string),
  owner_approvals_to_add: set(string),
  owner_approvals_to_remove: set(string),
  key_approvals_to_add: set(public_key),
  key_approvals_to_remove: set(public_key),
  extensions: set(future_extensions)
});

const delete_proposal = new Serializer("delete_proposal", {
  external_id: string,
  account: string,
  authority: uint16,
  extensions: set(future_extensions)
});

operation.st_operations = [
    vote_for_review, // 0

    transfer, // 1
    transfer_to_common_tokens, // 2
    withdraw_common_tokens, // 3

    create_account, // 4
    update_account, // 5

    witness_update, // 6
    account_witness_vote, // 7
    account_witness_proxy, // 8

    set_withdraw_common_tokens_route, // 9

    request_account_recovery, // 10
    recover_account, // 11
    change_recovery_account, // 12

    // DEIP native operations
    placeholder1, // 13
    delete_proposal, // 14
    create_proposal, // 15
    update_proposal, // 16
    make_review, // 17
    contribute_to_token_sale, // 18
    placeholder2, // 19
    placeholder3, // 20
    placeholder9, // 21
    placeholder4, // 22
    placeholder5, // 23 /* legacy */
    create_vesting_balance, // 24
    withdraw_vesting_balance, // 25

    transfer_research_share, // 26
    delegate_expertise, // 27
    revoke_expertise_delegation, // 28
    create_expertise_allocation_proposal, // 29
    vote_for_expertise_allocation_proposal, // 30
    placeholder6, // 31
    placeholder7, // 32
    create_grant, // 33
    create_grant_application, // 34
    make_review_for_application, // 35
    approve_grant_application, // 36
    reject_grant_application, // 37
    create_asset, // 38
    issue_asset, // 39
    reserve_asset, // 40
    create_award, // 41
    approve_award, // 42
    reject_award, // 43
    create_award_withdrawal_request, // 44
    certify_award_withdrawal_request, // 45
    approve_award_withdrawal_request, // 46
    reject_award_withdrawal_request, // 47
    pay_award_withdrawal_request, // 48
  
    join_research_group_membership,
    left_research_group_membership,
    create_research,
    create_research_content,
    create_research_token_sale,
    placeholder8,
    update_research,


    // virtual operations
    fill_common_tokens_withdraw,
    shutdown_witness,
    hardfork,
    producer_reward
];

let transaction = new Serializer(
    "transaction", {
        ref_block_num: uint16,
        ref_block_prefix: uint32,
        expiration: time_point_sec,
        operations: array(operation),
        extensions: set(future_extensions)
    }
);

//# -------------------------------
//#  Generated code end  S T O P
//# -------------------------------

// Custom Types (do not over-write)

const encrypted_memo = new Serializer("encrypted_memo", {
    from: public_key,
    to: public_key,
    nonce: uint64,
    check: uint32,
    encrypted: string_binary
});
/*

// Make sure all tests pass

npm test

*/