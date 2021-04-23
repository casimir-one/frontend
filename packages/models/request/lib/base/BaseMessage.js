import { assert } from '@deip/toolbox';


class BaseMessage {

  constructor(envelope, headers = {}) {
    assert(!!envelope, "Application command must be specified");
    this._envelope = envelope.serialize();
    this._headers = headers;
  }

  getRequestHeaders() { return this._headers; }
  getRequestBody() { throw new Error("Not implemented exception!"); }

}


export default BaseMessage;