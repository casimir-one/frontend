import CmdEnvelope from './CmdEnvelope';
import TxEnvelope from './TxEnvelope';


class BaseMsg {

  constructor({ tx, appCmds }, headers = {}) {
    const envelope = tx
      ? new TxEnvelope({ tx, appCmds })
      : new CmdEnvelope({ appCmds });

    this._envelope = envelope;
    this._headers = headers;
  }

  getHttpHeaders() { return this._headers; }
  getHttpBody() { throw new Error("Not implemented exception!"); }

}


export default BaseMsg;