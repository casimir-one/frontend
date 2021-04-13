class BaseRequest {

  constructor(appCmds, protocolTxs, headers) {
    this._appCmds = (appCmds || []).map(cmd => cmd.serialize());
    this._protocolTxs = (protocolTxs || []).map(tx => tx.serialize());
    this._headers = headers || {};
  }

  addCmd(cmd) { this._appCmds.push(cmd.serialize()); }
  addCmds(cmds) { this._appCmds.push(...cmds.map(cmd => cmd.serialize())); }

  addTx(tx) { this._protocolTxs.push(tx.serialize()); }
  addTxs(txs) { this._protocolTxs.push(...txs.map(tx => tx.serialize())); }

  getRequestHeaders() { return this._headers; }
  getRequestBody() { throw new Error("Not implemented exception!"); }

}


export default BaseRequest;