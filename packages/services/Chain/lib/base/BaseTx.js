import { assert } from '@deip/toolbox';


class BaseTx {
  _tx;
  _ops;
  _isFinalized;

  constructor(tx, ops) {
    this._tx = tx || null;
    this._ops = ops || [];
    this._isFinalized = !!this._tx;
  }

  getTx() {
    return this._tx;
  };

  getOps() {
    return this._ops;
  }

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

  getRawTx() { throw new Error("Not implemented exception!"); };
  signAsync() { throw new Error("Not implemented exception!"); }
  signByTenantAsync() { throw new Error("Not implemented exception!"); }
  getProtocolChain() { throw new Error("Not implemented exception!"); };
  serialize() { throw new Error("Not implemented exception!"); }
  deserialize() { throw new Error("Not implemented exception!"); }
  static Serialize(tx) { throw new Error("Not implemented exception!"); }
  static Deserialize(serialized) { throw new Error("Not implemented exception!"); }
}


export default BaseTx;