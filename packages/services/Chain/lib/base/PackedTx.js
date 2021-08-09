class PackedTx {

  _tx;
  _protocolCmds;

  constructor(tx, protocolCmds) { // TODO: make immutable
    this._tx = tx;
    this._protocolCmds = protocolCmds;
  }

  signAsync(signData, chainNodeClient, options) {
    return this._tx.signAsync(signData, chainNodeClient, options)
      .then(() => {
        return this;
      })
  }

  sendAsync(chainApi) {
    return this._tx.sendAsync(chainApi);
  }

  getPayload() {
    return { tx: this._tx, appCmds: this._protocolCmds };
  }

}


export default PackedTx;