import BaseRequest from './base/BaseRequest';


class ApplicationJsonRequest extends BaseRequest {

  constructor(jsonData, appCmds, headers) {
    super(appCmds, headers);
    this._headers['content-type'] = 'application/json';
    this._jsonData = jsonData || {};
  }

  getRequestBody() {
    return {
      ...this._jsonData,
      appCmds: this._appCmds
    };
  }

}


export default ApplicationJsonRequest;