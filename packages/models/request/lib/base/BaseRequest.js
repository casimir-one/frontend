import { assert } from '@deip/toolbox';


class BaseRequest {

  constructor(appCmd, headers = {}) {
    assert(!!appCmd, "Application command must be specified");
    this._appCmd = appCmd.serialize();
    this._headers = headers;
  }

  getRequestHeaders() { return this._headers; }
  getRequestBody() { throw new Error("Not implemented exception!"); }

}


export default BaseRequest;