import BaseHttpMsg from './base/BaseHttpMsg';


class JsonDataMsg extends BaseHttpMsg {

  constructor(payload, headers) {
    super(payload, headers);
    this._headers['content-type'] = 'application/json';
    this._jsonData = { 'envelope': this._envelope.serialize() };
  }

  getHttpBody() {
    return this._jsonData;
  }

}


export default JsonDataMsg;