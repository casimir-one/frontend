import BaseRequest from './base/BaseRequest';


class MultipartFormDataRequest extends BaseRequest {

  constructor(formData, appCmd, headers) {
    super(appCmd, headers);
    this._headers['content-type'] = 'multipart/form-data';
    this._formData = formData || new FormData();
  }

  getRequestBody() {
    this._formData.set('appCmd', JSON.stringify(this._appCmd));
    return this._formData;
  }

}


export default MultipartFormDataRequest;