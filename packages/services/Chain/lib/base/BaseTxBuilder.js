import { assert } from '@deip/toolbox';
import PackedTx from './PackedTx';


class BaseTxBuilder {

  _tx;
  _protocolCmds;
  _chainNodeClient;
  _chainOpsRegistry;

  constructor(chainNodeClient, chainOpsRegistry) {
    this._chainNodeClient = chainNodeClient;
    this._chainOpsRegistry = chainOpsRegistry;
    this._tx = null;
    this._protocolCmds = [];
  }

  clear() {
    this._tx = null;
    this._protocolCmds = [];
  }

  addCmd(protocolCmd) {
    assert(!!this._tx, "Transaction is not initiated");
    assert(protocolCmd.isProtocolOpCmd(), "Transaction can contain only protocol chain related commands");
    this._tx.addOp(this.cmdToOp(protocolCmd));
    this._protocolCmds.push(protocolCmd);
  }

  cmdToOp(protocolCmd) {
    assert(protocolCmd.isProtocolOpCmd(), "Not a protocol chain related command");
    const op = this._chainOpsRegistry.get(protocolCmd.getCmdNum())(protocolCmd.getCmdPayload(), { cmdToOp: (cmd) => this.cmdToOp(cmd)});
    return op;
  }

  begin(options) { throw new Error("Not implemented exception!"); }
  end(options) { throw new Error("Not implemented exception!"); }

  finalize() {
    if (!this._tx.isSealed())
      this._tx.seal();
    return new PackedTx(this._tx, this._protocolCmds);
  }

}


export default BaseTxBuilder;