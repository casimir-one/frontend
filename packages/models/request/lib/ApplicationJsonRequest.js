import BaseRequest from './base/BaseRequest';


class ApplicationJsonRequest extends BaseRequest {

  constructor(jsonData, appCmds, protocolTxs, headers) {
    super(appCmds, protocolTxs, headers);
    this._headers['content-type'] = 'application/json';
    this._jsonData = jsonData || {};
  }

  getRequestBody() {
    return {
      ...this._jsonData,
      appCmds: this._appCmds,
      protocolTxs: this._protocolTxs
    };
  }

}


export default ApplicationJsonRequest;