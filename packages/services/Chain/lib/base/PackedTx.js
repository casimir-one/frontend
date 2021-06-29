class PackedTx {

  _tx;
  _protocolCmds;

  constructor(tx, protocolCmds) { // TODO: make immutable
    this._tx = tx;
    this._protocolCmds = protocolCmds;
  }

  sign(privKey) {
    this._tx.sign(privKey);
  }

  getPayload() {
    return { tx: this._tx, appCmds: this._protocolCmds };
  }

}


export default PackedTx;