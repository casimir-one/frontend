"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _libCrypto = require("@casimir.one/lib-crypto");

var _libCrypto2 = _interopRequireDefault(_libCrypto);

var _types = require("./auth/serializer/src/types");

var _types2 = _interopRequireDefault(_types);

var _ChainTypes = require("./auth/serializer/src/ChainTypes");

var _ChainTypes2 = _interopRequireDefault(_ChainTypes);

var _operations = require("./auth/serializer/src/operations");

var _operations2 = _interopRequireDefault(_operations);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createEntityOperation(_ref, _ref2) {
  var _ref3 = _slicedToArray(_ref, 2),
      op_name = _ref3[0],
      op_payload = _ref3[1];

  var refBlockNum = _ref2.refBlockNum,
      refBlockPrefix = _ref2.refBlockPrefix;

  var serializer = _operations2.default[op_name];
  if (!serializer.entity_external_id) {
    throw new Error("External id extraction failure: 'entity_external_id' field is not specified for " + op_name);
  }

  var buff = toArrayBuffer(serializer.toEntityExternalIdBuffer(op_payload, { refBlockNum: refBlockNum, refBlockPrefix: refBlockPrefix }));
  var external_id = _libCrypto2.default.hexify(_libCrypto2.default.ripemd160(buff));
  op_payload[serializer.entity_external_id] = external_id;
  return [external_id, [op_name, op_payload]];
}

function toArrayBuffer(buf) {
  var ab = new ArrayBuffer(buf.length);
  var view = new Uint8Array(ab);
  for (var i = 0; i < buf.length; ++i) {
    view[i] = buf[i];
  }
  return ab;
}

function getOperationTag(op_name) {
  return _ChainTypes2.default.operations[op_name];
}

function getOperationsEnum() {
  return _ChainTypes2.default.operations;
}

module.exports = {
  createEntityOperation: createEntityOperation,
  getOperationTag: getOperationTag,
  getOperationsEnum: getOperationsEnum
};