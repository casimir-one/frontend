import AppMsg from './AppMsg';
import AppMsgEnvelope from './AppMsgEnvelope';

class BaseHttpMsg {

  constructor({ tx, appCmds }, headers = {}) {
    this._envelope = new AppMsgEnvelope(new AppMsg({ tx, appCmds }));
    this._headers = headers;
  }

  getHttpHeaders() { return this._headers; }
  getHttpBody() { throw new Error("Not implemented exception!"); }

  static UnwrapEnvelope(data, TxClass, chainMetadata) {
    const serialized = typeof data === 'string' ? JSON.parse(data) : data;
    const envelope = AppMsgEnvelope.Deserialize(serialized, TxClass, chainMetadata);
    return envelope.unwrap();
  }

}


export default BaseHttpMsg;