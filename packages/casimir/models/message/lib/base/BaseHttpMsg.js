import AppMsg from './AppMsg';
import AppMsgEnvelope from './AppMsgEnvelope';

/**
 * Base HTTP message
 */
class BaseHttpMsg {
  /**
   * Create base HTTP message
   * @param {Object} message
   * @param {import("@casimir/chain-service").BaseTx} message.tx transaction
   * @param {Array} message.appCmds commands
   * @param {Object} [headers={}]
   */
  constructor(message, headers = {}) {
    const { tx, appCmds } = message;
    this._envelope = new AppMsgEnvelope(new AppMsg({ tx, appCmds }));
    this._headers = headers;
  }

  /**
   * Get HTTP request headers
   * @returns {Object} headers
   */
  getHttpHeaders() { return this._headers; }

  /**
   * Get HTTP request body
   */
  getHttpBody() { throw new Error('Not implemented exception!'); }

  /**
   * Unwrap envelope
   * @param {string|Object} data
   * @param {*} TxClass
   * @param {*} chainMetadata
   * @returns {AppMsgEnvelope}
   * @static
   */
  static UnwrapEnvelope(data, TxClass, chainMetadata) {
    const serialized = typeof data === 'string' ? JSON.parse(data) : data;
    const envelope = AppMsgEnvelope.Deserialize(serialized, TxClass, chainMetadata);
    return envelope.unwrap();
  }
}

export default BaseHttpMsg;
