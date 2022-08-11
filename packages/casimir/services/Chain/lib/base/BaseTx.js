import { assert } from '@casimir/toolbox';


class BaseTx {
  _tx;
  _ops;
  _isFinalized;
  _portalId;

  constructor(tx, ops, portalId) {
    this._tx = tx || null;
    this._ops = ops || [];
    this._isFinalized = !!this._tx;
    this._portalId = portalId || null;
  }

  getTx() {
    return this._tx;
  };

  getOps() {
    return this._ops;
  }

  getPortalId() {
    return this._portalId;
  };

  addOp(op) {
    assert(!this.isFinalized(), "Transaction cannot be modified after it has been finalized");
    this._ops.push(op);
    return this;
  }

  isFinalized() {
    return this._isFinalized;
  }

  finalize(tx) {
    this._tx = tx;
    this._isFinalized = true;
  }

  isOnBehalfPortal() {
    return !!this._portalId;
  }

  getRawTx() { throw new Error("Not implemented exception!"); };
  getSignedRawTx() { throw new Error("Not implemented exception!"); };
  signAsync() { throw new Error("Not implemented exception!"); };
  isSigned() { throw new Error("Not implemented exception!"); };
  verifyByPortalAsync() { throw new Error("Not implemented exception!"); };
  getProtocolChain() { throw new Error("Not implemented exception!"); };
  serialize() { throw new Error("Not implemented exception!"); };
  deserialize(serializedTx) { throw new Error("Not implemented exception!"); };
  static Serialize(tx) { throw new Error("Not implemented exception!"); };
  static Deserialize(serializedTx) { throw new Error("Not implemented exception!"); };
}


export default BaseTx;