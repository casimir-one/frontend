import BaseMsg from './base/BaseMsg';


class JsonDataMsg extends BaseMsg {

  constructor(payload, headers) {
    super(payload, headers);
    this._headers['content-type'] = 'application/json';
  }

  getHttpBody() {
    return { 'envelope': this._envelope.serialize() };
  }

}


export default JsonDataMsg;