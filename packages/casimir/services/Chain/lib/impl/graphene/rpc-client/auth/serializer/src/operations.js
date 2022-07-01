"use strict";

var _types = require("./types");

var _types2 = _interopRequireDefault(_types);

var _serializer = require("./serializer");

var _serializer2 = _interopRequireDefault(_serializer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

var uint8 = _types2.default.uint8,
    int16 = _types2.default.int16,
    int64 = _types2.default.int64,
    uint16 = _types2.default.uint16,
    uint32 = _types2.default.uint32,
    uint64 = _types2.default.uint64,
    string = _types2.default.string,
    string_binary = _types2.default.string_binary,
    bytes = _types2.default.bytes,
    bool = _types2.default.bool,
    array = _types2.default.array,
    static_variant = _types2.default.static_variant,
    map = _types2.default.map,
    set = _types2.default.set,
    public_key = _types2.default.public_key,
    time_point_sec = _types2.default.time_point_sec,
    optional = _types2.default.optional,
    asset = _types2.default.asset,
    percent = _types2.default.percent;


var future_extensions = _types2.default.void;
var hardfork_version_vote = _types2.default.void;
var version = _types2.default.void;

// Place-holder, their are dependencies on "operation" .. The final list of
// operations is not avialble until the very end of the generated code.
// See: operation.st_operations = ...
var operation = static_variant();
module.exports.operation = operation;

// For module.exports
var Serializer = function Serializer(operation_name, serilization_types_object) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var s = new _serializer2.default(operation_name, serilization_types_object, options);
  return module.exports[operation_name] = s;
};

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

var tenant_affirmation = new Serializer("tenant_affirmation", {
  tenant: string,
  signature: bytes(65),
  extensions: set(future_extensions)
});

var signed_transaction = new Serializer("signed_transaction", {
  ref_block_num: uint16,
  ref_block_prefix: uint32,
  expiration: time_point_sec,
  operations: array(operation),
  extensions: set(future_extensions),
  signatures: array(bytes(65)),
  tenant_signature: optional(tenant_affirmation)
});

var signed_block = new Serializer("signed_block", {
  previous: bytes(20),
  timestamp: time_point_sec,
  witness: string,
  transaction_merkle_root: bytes(20),
  extensions: set(static_variant([future_extensions, version, hardfork_version_vote])),
  witness_signature: bytes(65),
  transactions: array(signed_transaction)
});

var block_header = new Serializer("block_header", {
  previous: bytes(20),
  timestamp: time_point_sec,
  witness: string,
  transaction_merkle_root: bytes(20),
  extensions: set(static_variant([future_extensions, version, hardfork_version_vote]))
});

var signed_block_header = new Serializer("signed_block_header", {
  previous: bytes(20),
  timestamp: time_point_sec,
  witness: string,
  transaction_merkle_root: bytes(20),
  extensions: set(static_variant([future_extensions, version, hardfork_version_vote])),
  witness_signature: bytes(65)
});

var challenge_authority = new Serializer("challenge_authority", {
  challenger: string,
  challenged: string,
  require_owner: bool
});

var authority = new Serializer("authority", {
  weight_threshold: uint32,
  account_auths: map(string, uint16),
  key_auths: map(public_key, uint16)
});

var research_group = new Serializer("research_group", {
  description: string,
  extensions: set(future_extensions)
});

var create_account = new Serializer("create_account", {
  fee: asset,
  creator: string,
  new_account_name: string,
  owner: authority,
  active: authority,
  active_overrides: map(uint16, authority),
  memo_key: public_key,
  json_metadata: optional(string),
  traits: set(static_variant([// deprecated
  research_group])),
  extensions: set(future_extensions)
}, { entity_external_id: "new_account_name" });

var authority_update = new Serializer("authority_update", {
  active_accounts_to_add: map(string, uint16),
  active_accounts_to_remove: set(string),

  owner_accounts_to_add: map(string, uint16),
  owner_accounts_to_remove: set(string),

  active_keys_to_add: map(public_key, uint16),
  active_keys_to_remove: set(public_key),

  owner_keys_to_add: map(public_key, uint16),
  owner_keys_to_remove: set(public_key)
});

var update_account = new Serializer("update_account", {
  account: string,
  owner: optional(authority),
  active: optional(authority),
  active_overrides: optional(map(uint16, optional(authority))),
  memo_key: optional(public_key),
  json_metadata: optional(string),
  traits: optional(set(static_variant([// deprecated
  research_group]))),
  update_extensions: set(static_variant([authority_update]))
});

var transfer = new Serializer("transfer", {
  from: string,
  to: string,
  amount: asset,
  memo: string,
  extensions: set(future_extensions)
});

var transfer_to_common_tokens = new Serializer("transfer_to_common_tokens", {
  "from": string,
  "to": string,
  "amount": asset,
  extensions: set(future_extensions)
});

var withdraw_common_tokens = new Serializer("withdraw_common_tokens", {
  "account": string,
  "total_common_tokens_amount": int64,
  extensions: set(future_extensions)
});

var set_withdraw_common_tokens_route = new Serializer("set_withdraw_common_tokens_route", {
  from_account: string,
  to_account: string,
  percent: uint16,
  auto_common_token: bool,
  extensions: set(future_extensions)
});

var chain_properties = new Serializer("chain_properties", {
  account_creation_fee: asset,
  maximum_block_size: uint32,
  sbd_interest_rate: uint16
});

var witness_update = new Serializer("witness_update", {
  owner: string,
  url: string,
  block_signing_key: public_key,
  props: chain_properties,
  fee: asset,
  extensions: set(future_extensions)
});

var account_witness_vote = new Serializer("account_witness_vote", {
  account: string,
  witness: string,
  approve: bool,
  extensions: set(future_extensions)
});

var account_witness_proxy = new Serializer("account_witness_proxy", {
  account: string,
  proxy: string,
  extensions: set(future_extensions)
});

var request_account_recovery = new Serializer("request_account_recovery", {
  recovery_account: string,
  account_to_recover: string,
  new_owner_authority: authority,
  extensions: set(future_extensions)
});

var recover_account = new Serializer("recover_account", {
  account_to_recover: string,
  new_owner_authority: authority,
  recent_owner_authority: authority,
  extensions: set(future_extensions)
});

var change_recovery_account = new Serializer("change_recovery_account", {
  account_to_recover: string,
  new_recovery_account: string,
  extensions: set(future_extensions)
});

var join_research_contract = new Serializer("join_research_contract", {
  member: string,
  research_group: string,
  reward_share: percent,
  researches: optional(set(string)), // deprecated
  extensions: set(future_extensions)
});

var leave_research_contract = new Serializer("leave_research_contract", {
  member: string,
  research_group: string,
  is_exclusion: bool,
  extensions: set(future_extensions)
});

var create_research_content = new Serializer("create_research_content", {
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

var create_research_token_sale = new Serializer("create_research_token_sale", {
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

var contribute_to_token_sale = new Serializer("contribute_to_token_sale", {
  token_sale_external_id: string,
  contributor: string,
  amount: asset,
  extensions: set(future_extensions)
});

var transfer_research_share = new Serializer("transfer_research_share", {
  research_external_id: string,
  sender: string,
  receiver: string,
  share: percent,
  extensions: set(future_extensions)
});

var research_security_token = new Serializer("research_security_token", {
  research_external_id: string,
  research_group: string,
  extensions: set(future_extensions)
});

var create_asset = new Serializer("create_asset", {
  "issuer": string,
  "symbol": string,
  "precision": uint8,
  "description": string,
  "max_supply": int64,
  "traits": set(static_variant([research_security_token])),
  "extensions": set(future_extensions)
});

var issue_asset = new Serializer("issue_asset", {
  "issuer": string,
  "amount": asset,
  "recipient": string,
  "memo": optional(string),
  "extensions": set(future_extensions)
});

var reserve_asset = new Serializer("reserve_asset", {
  "owner": string,
  "amount": asset,
  "extensions": set(future_extensions)
});

var create_vesting_balance = new Serializer("create_vesting_balance", {
  "creator": string,
  "owner": string,
  "balance": asset,
  "vesting_duration_seconds": uint32,
  "vesting_cliff_seconds": uint32,
  "period_duration_seconds": uint32,
  extensions: set(future_extensions)
});

var withdraw_vesting_balance = new Serializer("withdraw_vesting_balance", {
  "vesting_balance_id": int64,
  "owner": string,
  "amount": asset,
  extensions: set(future_extensions)
});

var op_wrapper = new Serializer("op_wrapper", { op: operation }, { nosort: true });

var create_proposal = new Serializer("create_proposal", {
  external_id: string,
  creator: string,
  proposed_ops: array(op_wrapper),
  expiration_time: time_point_sec,
  review_period_seconds: optional(uint32),
  extensions: set(future_extensions)
}, { entity_external_id: "external_id" });

var update_proposal = new Serializer("update_proposal", {
  external_id: string,
  active_approvals_to_add: set(string),
  active_approvals_to_remove: set(string),
  owner_approvals_to_add: set(string),
  owner_approvals_to_remove: set(string),
  key_approvals_to_add: set(public_key),
  key_approvals_to_remove: set(public_key),
  extensions: set(future_extensions)
});

var delete_proposal = new Serializer("delete_proposal", {
  external_id: string,
  account: string,
  authority: uint16,
  extensions: set(future_extensions)
});

var licensing_fee = new Serializer("licensing_fee", {
  terms: string,
  fee: optional(asset),
  expiration_time: optional(time_point_sec)
});

var create_research_license = new Serializer("create_research_license", {
  external_id: string,
  research_external_id: string,
  licenser: string,
  licensee: string,
  license_conditions: static_variant([licensing_fee]),
  extensions: set(future_extensions)
}, { entity_external_id: "external_id" });

var create_contract_agreement = new Serializer("create_contract_agreement", {
  external_id: string,
  creator: string,
  parties: set(string),
  hash: string,
  start_time: optional(time_point_sec),
  end_time: optional(time_point_sec),
  terms: set(future_extensions),
  extensions: set(future_extensions)
}, { entity_external_id: "external_id" });

var accept_contract_agreement = new Serializer("accept_contract_agreement", {
  external_id: string,
  party: string,
  extensions: set(future_extensions)
});

var reject_contract_agreement = new Serializer("reject_contract_agreement", {
  external_id: string,
  party: string,
  extensions: set(future_extensions)
});

// virtual operations

var fill_common_tokens_withdraw = new Serializer("fill_common_tokens_withdraw", {
  from_account: string,
  to_account: string,
  withdrawn: asset,
  deposited: asset
});

var shutdown_witness = new Serializer("shutdown_witness", {
  owner: string
});

var hardfork = new Serializer("hardfork", {
  hardfork_id: uint32
});

var producer_reward = new Serializer("producer_reward", {
  producer: string,
  common_tokens_amount: uint32
});

operation.st_operations = [create_account, // 0
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

join_research_contract, // 12
leave_research_contract, // 13
create_research, // 14
update_research, // 15
create_research_content, // 16

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

create_research_license, // 52
create_contract_agreement, // 53
accept_contract_agreement, // 54
reject_contract_agreement, // 55

// virtual operations
fill_common_tokens_withdraw, shutdown_witness, hardfork, producer_reward];

var transaction = new Serializer("transaction", {
  ref_block_num: uint16,
  ref_block_prefix: uint32,
  expiration: time_point_sec,
  operations: array(operation),
  extensions: set(future_extensions)
});

//# -------------------------------
//#  Generated code end  S T O P
//# -------------------------------

// Custom Types (do not over-write)

var encrypted_memo = new Serializer("encrypted_memo", {
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