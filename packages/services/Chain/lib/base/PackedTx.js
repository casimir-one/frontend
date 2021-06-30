class PackedTx {

  _tx;
  _protocolCmds;

  constructor(tx, protocolCmds) { // TODO: make immutable
    this._tx = tx;
    this._protocolCmds = protocolCmds;
  }

  signAsync(signData, chainNodeClient) {
    return this._tx.signAsync(signData, chainNodeClient)
      .then((tx) => {
        return this;
      })
  }

  getPayload() {
    return { tx: this._tx, appCmds: this._protocolCmds };
  }

}


export default PackedTx;