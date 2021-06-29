import BaseMsg from './base/BaseMsg';


class MultFormDataMsg extends BaseMsg {

  constructor(formData, payload, headers) {
    super(payload, headers);
    this._headers['content-type'] = 'multipart/form-data';
    this._formData = formData || new FormData();
  }

  getHttpBody() {
    this._formData.set('envelope', JSON.stringify(this._envelope.serialize()));
    return this._formData;
  }

}


export default MultFormDataMsg;