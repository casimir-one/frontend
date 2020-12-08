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


const challenge_authority = new Serializer("challenge_authority", {
  challenger: string,
  challenged: string,
  require_owner: bool
});

const authority = new Serializer("authority", {
  weight_threshold: uint32,
  account_auths: map((string), (uint16)),
  key_auths: map((public_key), (uint16))
});

const research_group = new Serializer("research_group", {
  description: string,
  extensions: set(future_extensions)
});

const create_account = new Serializer("create_account", {
  fee: asset,
  creator: string,
  new_account_name: string,
  owner: authority,
  active: authority,
  active_overrides: map(uint16, authority),
  memo_key: public_key,
  json_metadata: optional(string),
  traits: set(static_variant([
    research_group
  ])),
  extensions: set(future_extensions)
}, { entity_external_id: "new_account_name" });


const update_account = new Serializer("update_account", {
  account: string,
  owner: optional(authority),
  active: optional(authority),
  active_overrides: optional(map(uint16, optional(authority))),
  memo_key: optional(public_key),
  json_metadata: optional(string),
  traits: optional(set(static_variant([
    research_group
  ]))),
  extensions: set(future_extensions)
});


const transfer = new Serializer("transfer", {
  from: string,
  to: string,
  amount: asset,
  memo: string,
  extensions: set(future_extensions)
});


const transfer_to_common_tokens = new Serializer("transfer_to_common_tokens", {
  "from": string,
  "to": string,
  "amount": asset,
  extensions: set(future_extensions)
});


const withdraw_common_tokens = new Serializer("withdraw_common_tokens", {
  "account": string,
  "total_common_tokens_amount": int64,
  extensions: set(future_extensions)
});


const set_withdraw_common_tokens_route = new Serializer("set_withdraw_common_tokens_route", {
  from_account: string,
  to_account: string,
  percent: uint16,
  auto_common_token: bool,
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
  fee: asset,
  extensions: set(future_extensions)
});


const account_witness_vote = new Serializer("account_witness_vote", {
  account: string,
  witness: string,
  approve: bool,
  extensions: set(future_extensions)
});


const account_witness_proxy = new Serializer("account_witness_proxy", {
  account: string,
  proxy: string,
  extensions: set(future_extensions)
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


const join_research_group_membership = new Serializer("join_research_group_membership", {
  member: string,
  research_group: string,
  reward_share: percent,
  researches: optional(set(string)),
  extensions: set(future_extensions)
});


const leave_research_group_membership = new Serializer("leave_research_group_membership", {
  member: string,
  research_group: string,
  is_exclusion: bool,
  extensions: set(future_extensions)
});


const create_research = new Serializer("create_research", {
  external_id: string,
  research_group: string,
  description: string,
  disciplines: set(string),
  is_private: bool,
  review_share: optional(percent),
  compensation_share: optional(percent),
  members: optional(set(string)),
  extensions: set(future_extensions)
}, { entity_external_id: "external_id" });


const update_research = new Serializer("update_research", {
  research_group: string,
  external_id: string,
  description: optional(string),
  is_private: optional(bool),
  review_share: optional(percent),
  compensation_share: optional(percent),
  members: optional(set(string)),
  extensions: set(future_extensions)
});


const create_research_content = new Serializer("create_research_content", {
  external_id: string,
  research_external_id: string,
  research_group: string,
  type: uint16,
  description: string,
  content: string,
  authors: set(string),
  references: set(string),
  extensions: set(future_extensions)
}, { entity_external_id: "external_id" });


const binary_scoring_assessment_model = new Serializer("binary_scoring_assessment_model", {
  is_positive: bool,
  extensions: set(future_extensions)
});

const multicriteria_scoring_assessment_model = new Serializer("multicriteria_scoring_assessment_model", {
  scores: map((uint16), (uint16)),
  extensions: set(future_extensions)
});

const create_review = new Serializer("create_review", {
  external_id: string,
  author: string,
  research_content_external_id: string,
  content: string,
  weight: percent,
  assessment_model: static_variant([
    binary_scoring_assessment_model,
    multicriteria_scoring_assessment_model
  ]),
  disciplines: set(string),
  extensions: set(future_extensions)
}, { entity_external_id: "external_id" });


const vote_for_review = new Serializer("vote_for_review", {
  external_id: string,
  voter: string,
  review_external_id: string,
  discipline_external_id: string,
  weight: percent,
  extensions: set(future_extensions)
}, { entity_external_id: "external_id" });


const create_research_token_sale = new Serializer("create_research_token_sale", {
  external_id: string,
  research_group: string,
  research_external_id: string,
  start_time: time_point_sec,
  end_time: time_point_sec,
  security_tokens_on_sale: set(asset),
  soft_cap: asset,
  hard_cap: asset,
  extensions: set(future_extensions)
}, { entity_external_id: "external_id" });


const contribute_to_token_sale = new Serializer("contribute_to_token_sale", {
  token_sale_external_id: string,
  contributor: string,
  amount: asset,
  extensions: set(future_extensions)
});


const transfer_research_share = new Serializer("transfer_research_share", {
  research_external_id: string,
  sender: string,
  receiver: string,
  share: percent,
  extensions: set(future_extensions)
})

const research_security_token = new Serializer("research_security_token", {
  research_external_id: string,
  research_group: string,
  extensions: set(future_extensions)
});

const research_license_revenue = new Serializer("research_license_revenue", {
  holders_share: percent,
  extensions: set(future_extensions)
});


const create_asset = new Serializer("create_asset", {
    "issuer": string,
    "symbol": string,
    "precision": uint8,
    "description": string,
    "max_supply": int64,
    "traits": set(static_variant([
      research_security_token,
      research_license_revenue
    ])),
    "extensions": set(future_extensions)
});

const issue_asset = new Serializer("issue_asset", {
  "issuer": string,
  "amount": asset,
  "recipient": string,
  "memo": optional(string),
  "extensions": set(future_extensions)
});

const reserve_asset = new Serializer("reserve_asset", {
  "owner": string,
  "amount": asset,
  "extensions": set(future_extensions)
});


const create_vesting_balance = new Serializer("create_vesting_balance", {
  "creator": string,
  "owner": string,
  "balance": asset,
  "vesting_duration_seconds": uint32,
  "vesting_cliff_seconds": uint32,
  "period_duration_seconds": uint32,
  extensions: set(future_extensions)
});


const withdraw_vesting_balance = new Serializer("withdraw_vesting_balance", {
  "vesting_balance_id": int64,
  "owner": string,
  "amount": asset,
  extensions: set(future_extensions)
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


const create_expertise_allocation_proposal = new Serializer("create_expertise_allocation_proposal", {
  claimer: string,
  discipline_id: int64,
  description: string,
  extensions: set(future_extensions)
});


const vote_for_expertise_allocation_proposal = new Serializer("vote_for_expertise_allocation_proposal", {
  proposal_id: int64,
  voter: string,
  voting_power: int64,
  extensions: set(future_extensions)
});


const discipline_supply_announcement_contract = new Serializer("discipline_supply_announcement_contract", {
  start_time: time_point_sec,
  end_time: time_point_sec,
  is_extendable: bool,
  content_hash: string,
  additional_info: map((string), (string)),
  extensions: set(future_extensions)
});


const announced_application_window_contract = new Serializer("announced_application_window_contract", {
  review_committee_id: string,
  min_number_of_positive_reviews: uint16,
  min_number_of_applications: uint16,
  max_number_of_research_to_grant: uint16,
  start_date: time_point_sec,
  end_date: time_point_sec,
  additional_info: map((string), (string)),
  extensions: set(future_extensions)
});


const funding_opportunity_announcement_contract = new Serializer("funding_opportunity_announcement_contract", {
  organization_id: string,
  review_committee_id: string,
  treasury_id: string,
  award_ceiling: asset,
  award_floor: asset,
  expected_number_of_awards: uint16,
  open_date: time_point_sec,
  close_date: time_point_sec,
  officers: set(string),
  additional_info: map((string), (string)),
  extensions: set(future_extensions)
});


const create_grant = new Serializer("create_grant", {
  "external_id": string,
  "grantor": string,
  "amount": asset,
  "target_disciplines": set(string),
  "distribution_model": static_variant([
    announced_application_window_contract,
    funding_opportunity_announcement_contract,
    discipline_supply_announcement_contract
  ]),
  "extensions": set(future_extensions)
});


const create_grant_application = new Serializer("create_grant_application", {
  "grant_id": int64,
  "research_id": int64,
  "creator": string,
  "application_hash": string,
  "extensions": set(future_extensions)
});


const create_review_for_application = new Serializer("create_review_for_application", {
  "author": string,
  "grant_application_id": int64,
  "is_positive": bool,
  "content": string,
  "weight": uint16,
  "extensions": set(future_extensions)
});


const approve_grant_application = new Serializer("approve_grant_application", {
  "grant_application_id": int64,
  "approver": string,
  "extensions": set(future_extensions)
});


const reject_grant_application = new Serializer("reject_grant_application", {
  "grant_application_id": int64,
  "rejector": string,
  "extensions": set(future_extensions)
});


const subawardee = new Serializer("subawardee", {
  subaward_number: string,
  subaward: asset,
  subawardee: string,
  source: string,
  research_external_id: string
});

const create_award = new Serializer("create_award", {
  "award_number": string,
  "funding_opportunity_number": string,
  "award": asset,
  "awardee": string,
  "research_external_id": string,
  "university_external_id": string,
  "university_overhead": percent,
  "subawardees": array(subawardee),
  "creator": string,
  "extensions": set(future_extensions)
});


const approve_award = new Serializer("approve_award", {
  "award_number": string,
  "approver": string,
  "extensions": set(future_extensions)
});


const reject_award = new Serializer("reject_award", {
  "award_number": string,
  "rejector": string,
  "extensions": set(future_extensions)
});


const create_award_withdrawal_request = new Serializer("create_award_withdrawal_request", {
  "payment_number": string,
  "award_number": string,
  "subaward_number": optional(string),
  "requester": string,
  "amount": asset,
  "description": string,
  "attachment": string,
  "extensions": set(future_extensions)
});


const certify_award_withdrawal_request = new Serializer("certify_award_withdrawal_request", {
  "payment_number": string,
  "award_number": string,
  "subaward_number": optional(string),
  "certifier": string,
  "extensions": set(future_extensions)
});


const approve_award_withdrawal_request = new Serializer("approve_award_withdrawal_request", {
  "payment_number": string,
  "award_number": string,
  "subaward_number": optional(string),
  "approver": string,
  "extensions": set(future_extensions)
});


const reject_award_withdrawal_request = new Serializer("reject_award_withdrawal_request", {
  "payment_number": string,
  "award_number": string,
  "subaward_number": optional(string),
  "rejector": string,
  "extensions": set(future_extensions)
});


const pay_award_withdrawal_request = new Serializer("pay_award_withdrawal_request", {
  "payment_number": string,
  "award_number": string,
  "subaward_number": optional(string),
  "payer": string,
  "extensions": set(future_extensions)
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
  end_date: time_point_sec,
  extensions: set(future_extensions)
});


const sign_nda_contract = new Serializer("sign_nda_contract", {
  contract_id: int64,
  contract_signer: string,
  signature: string,
  extensions: set(future_extensions)
});


const decline_nda_contract = new Serializer("decline_nda_contract", {
  contract_id: int64,
  decliner: string,
  extensions: set(future_extensions)
});


const close_nda_contract = new Serializer("close_nda_contract", {
  contract_id: int64,
  closer: string,
  extensions: set(future_extensions)
});


const create_request_by_nda_contract = new Serializer("create_request_by_nda_contract", {
  requester: string,
  encrypted_payload_hash: string,
  encrypted_payload_iv: string,
  contract_id: int64,
  extensions: set(future_extensions)
});


const fulfill_request_by_nda_contract = new Serializer("fulfill_request_by_nda_contract", {
  grantor: string,
  encrypted_payload_encryption_key: string,
  proof_of_encrypted_payload_encryption_key: string,
  request_id: int64,
  extensions: set(future_extensions)
});


const contribution_request = new Serializer("contribution_request", {
  tag: string,
  is_mandatory: bool,
  type: uint16,
  extensions: set(future_extensions)
});

const guard_fn = new Serializer("guard_fn", {
  fn_type: uint16,
  fn: optional(string),
  fn_args: optional(string),
  extensions: set(future_extensions)
});


const create_application_rule = new Serializer("create_application", {
  guard: guard_fn
});

const update_application_rule = new Serializer("update_application", {
  guard: guard_fn
});

const delete_application_rule = new Serializer("delete_application", {
  guard: guard_fn
});

const apply_phase_type = new Serializer("apply_phase", {
  start_time: time_point_sec,
  end_time: time_point_sec,
  options: set(static_variant([
    create_application_rule,
    update_application_rule,
    delete_application_rule
  ])),
  extensions: set(future_extensions)
});


const await_review_rule = new Serializer("await_review", {
  extensions: set(future_extensions)
});


const await_review_phase_type = new Serializer("await_review_phase", {
  start_time: time_point_sec,
  end_time: time_point_sec,
  options: set(static_variant([
    await_review_rule
  ])),
  extensions: set(future_extensions)
});



const create_review_rule = new Serializer("create_review_rule", {
  guard: guard_fn
});

const update_review_rule = new Serializer("update_review", {
  guard: guard_fn
});

const delete_review_rule = new Serializer("delete_review", {
  guard: guard_fn
});

const create_curation_rule = new Serializer("create_curation", {
  guard: guard_fn
});

const delete_curation_rule = new Serializer("delete_curation", {
  guard: guard_fn
});

const review_phase_type = new Serializer("review_phase", {
  start_time: time_point_sec,
  end_time: time_point_sec,
  options: set(static_variant([
    create_review_rule,
    update_review_rule,
    delete_review_rule,
    create_curation_rule,
    delete_curation_rule
  ])),
  extensions: set(future_extensions)
});


const auto_decision_making_rule = new Serializer("auto_decision_making", {
  guard: guard_fn
});

const manual_decision_making_rule = new Serializer("manual_decision_making", {
  decision_makers: set(string),
  extensions: set(future_extensions)
});


const decision_phase_type = new Serializer("decision_phase", {
  start_time: time_point_sec,
  end_time: time_point_sec,
  options: set(static_variant([
    auto_decision_making_rule,
    manual_decision_making_rule
  ])),
  extensions: set(future_extensions)
});



const assessment_stage = new Serializer("assessment_stage", {
  external_id: string,
  contributions_requests: array(contribution_request),
  phases: set(static_variant([
    apply_phase_type,
    await_review_phase_type,
    review_phase_type,
    decision_phase_type
  ])),
  extensions: set(future_extensions)
});


const create_assessment = new Serializer("create_assessment", {
  external_id: string,
  creator: string,
  stages: array(assessment_stage),
  extensions: set(future_extensions)
}, { entity_external_id: "external_id" });


const licensing_fee = new Serializer("licensing_fee", {
  terms: string,
  fee: optional(asset),
  expiration_time: optional(time_point_sec)
});


const create_research_license = new Serializer("create_research_license", {
  external_id: string,
  research_external_id: string,
  licenser: string,
  licensee: string,
  license_conditions: static_variant([
    licensing_fee
  ]),
  extensions: set(future_extensions)
}, { entity_external_id: "external_id" });


// virtual operations

const fill_common_tokens_withdraw = new Serializer("fill_common_tokens_withdraw", {
  from_account: string,
  to_account: string,
  withdrawn: asset,
  deposited: asset
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

operation.st_operations = [
  create_account, // 0
  update_account, // 1

  transfer, // 2
  transfer_to_common_tokens, // 3
  withdraw_common_tokens, // 4
  set_withdraw_common_tokens_route, // 5

  witness_update, // 6
  account_witness_vote, // 7
  account_witness_proxy, // 8

  request_account_recovery, // 9
  recover_account, // 10
  change_recovery_account, // 11

  join_research_group_membership, // 12
  leave_research_group_membership, // 13
  create_research, // 14
  update_research, // 15
  create_research_content, // 16

  create_review, // 17
  vote_for_review, // 18

  create_research_token_sale, // 19
  contribute_to_token_sale, // 20
  transfer_research_share, // 21

  create_asset, // 22
  issue_asset, // 23
  reserve_asset, // 24

  create_vesting_balance, // 25
  withdraw_vesting_balance, // 26

  create_proposal, // 27
  update_proposal, // 28
  delete_proposal, // 29

  create_expertise_allocation_proposal, // 30
  vote_for_expertise_allocation_proposal, // 31

  create_grant, // 32
  create_grant_application, // 33
  create_review_for_application, // 34
  approve_grant_application, // 35
  reject_grant_application, // 36
  create_award, // 37
  approve_award, // 38
  reject_award, // 39
  create_award_withdrawal_request, // 40
  certify_award_withdrawal_request, // 41
  approve_award_withdrawal_request, // 42
  reject_award_withdrawal_request, // 43
  pay_award_withdrawal_request, // 44

  create_nda_contract, // 45
  sign_nda_contract, // 46
  decline_nda_contract, // 47
  close_nda_contract, // 48
  create_request_by_nda_contract, // 49
  fulfill_request_by_nda_contract, // 50
  create_assessment, // 51
  create_research_license, // 52

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