import { assert } from '@deip/toolbox';
import TxEnvelope from './../TxEnvelope';


class BaseTxBuilder {

  constructor(api, protocol) {
    this._api = api;
    this._tx = null;
    this._txCtx = {
      protocol: protocol,
      appCmds: []
    };
  }

  clear() {
    this._tx = null;
    this._txCtx.appCmds = [];
  }

  addCmd(protocolCmd) {
    assert(!!this._tx, "Transaction is not initiated");
    assert(protocolCmd.isProtocolOpCmd(), "Transaction can contain only protocol related commands");
    
    this._tx.addOp(protocolCmd.getProtocolOp());
    this._txCtx.appCmds.push(protocolCmd);
  }

  getTxCtx() {
    assert(!!this._tx, "Transaction is not initiated");
    return this._txCtx;
  }

  begin(options) { throw new Error("Not implemented exception!"); }
  end(options) { throw new Error("Not implemented exception!"); }

  pack() {
    if (!this._tx.isSealed())
      this._tx.seal();
    return new TxEnvelope(this._tx, this._txCtx.appCmds);
  }

}


export default BaseTxBuilder;