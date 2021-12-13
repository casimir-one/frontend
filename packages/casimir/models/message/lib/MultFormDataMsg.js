import BaseHttpMsg from './base/BaseHttpMsg';


class MultFormDataMsg extends BaseHttpMsg {

  constructor(formData, payload, headers) {
    super(payload, headers);
    this._headers['content-type'] = 'multipart/form-data';
    this._formData = formData || new FormData();
    this._formData.set('envelope', JSON.stringify(this._envelope.serialize()));
  }

  getHttpBody() { 
    return this._formData; 
  }

}


export default MultFormDataMsg;