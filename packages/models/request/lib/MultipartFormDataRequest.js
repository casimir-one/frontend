import BaseRequest from './base/BaseRequest';


class MultipartFormDataRequest extends BaseRequest {

  constructor(formData, appCmds, headers) {
    super(appCmds, headers);
    this._headers['content-type'] = 'multipart/form-data';
    this._formData = formData || new FormData();
  }

  getRequestBody() {
    this._formData.set('appCmds', JSON.stringify(this._appCmds));
    return this._formData;
  }

}


export default MultipartFormDataRequest;