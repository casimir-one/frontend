import BaseHttpMsg from './base/BaseHttpMsg';

/**
 * JSON data message
 * @extends BaseHttpMsg
 */
class JsonDataMsg extends BaseHttpMsg {
  /**
   * Create JSON data message
   * @param {Object} payload
   * @param {Object} headers
   */
  constructor(payload, headers) {
    super(payload, headers);
    this._headers['content-type'] = 'application/json';
    this._jsonData = { envelope: this._envelope.serialize() };
  }

  /**
   * Get HTTP request body
   * @returns {Object}
   */
  getHttpBody() {
    return this._jsonData;
  }
}

export default JsonDataMsg;
