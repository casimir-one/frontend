import BaseMessage from './base/BaseMessage';


class MultipartFormDataMessage extends BaseMessage {

  constructor(formData, envelope, headers) {
    super(envelope, headers);
    this._headers['content-type'] = 'multipart/form-data';
    this._formData = formData || new FormData();
  }

  getRequestBody() {
    this._formData.set('envelope', JSON.stringify(this._envelope));
    return this._formData;
  }

}


export default MultipartFormDataMessage;