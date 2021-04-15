import BaseRequest from './base/BaseRequest';


class ApplicationJsonRequest extends BaseRequest {

  constructor(jsonData, appCmd, headers) {
    super(appCmd, headers);
    this._headers['content-type'] = 'application/json';
    this._jsonData = jsonData || {};
  }

  getRequestBody() {
    return {
      ...this._jsonData,
      appCmd: this._appCmd
    };
  }

}


export default ApplicationJsonRequest;