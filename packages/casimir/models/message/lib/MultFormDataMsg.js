import BaseHttpMsg from './base/BaseHttpMsg';

/**
 * Multipart form data message
 * @extends BaseHttpMsg
 */
class MultFormDataMsg extends BaseHttpMsg {
/**
 * Create multipart form data message
 * @param {FoemData} formData
 * @param {Object} payload
 * @param {Object} headers
 */
  constructor(formData, payload, headers) {
    super(payload, headers);
    this._headers['content-type'] = 'multipart/form-data';
    this._formData = formData || new FormData();
    this._formData.set('envelope', JSON.stringify(this._envelope.serialize()));
  }

  /**
   * Get HTTP request body
   * @returns {Object}
   */
  getHttpBody() {
    return this._formData;
  }
}

export default MultFormDataMsg;
