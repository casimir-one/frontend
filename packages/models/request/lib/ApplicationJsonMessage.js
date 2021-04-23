import BaseMessage from './base/BaseMessage';


class ApplicationJsonMessage extends BaseMessage {

  constructor(jsonData, envelope, headers) {
    super(envelope, headers);
    this._headers['content-type'] = 'application/json';
    this._jsonData = jsonData || {};
  }

  getRequestBody() {
    return {
      ...this._jsonData,
      'envelope': this._envelope
    };
  }

}


export default ApplicationJsonMessage;