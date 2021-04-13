import BaseRequest from './base/BaseRequest';


class MultipartFormDataRequest extends BaseRequest {

  constructor(formData, appCmds, protocolTxs, headers) {
    super(appCmds, protocolTxs, headers);
    this._headers['content-type'] = 'multipart/form-data';
    this._formData = formData || new FormData();
  }

  getRequestBody() {
    this._formData.set('appCmds', JSON.stringify(this._appCmds));
    this._formData.set('protocolTxs', JSON.stringify(this._protocolTxs));
    return this._formData;
  }

}


export default MultipartFormDataRequest;