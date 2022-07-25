import { FinalizedTx } from '@deip/chain-service';
import AppMsg from './base/AppMsg';
import AppMsgEnvelope from './base/AppMsgEnvelope';

/**
 * Message created from finalized transaction
 */
class FinalizedTxMsg {
  /**
   * Create message from finalized transaction
   * @param {FinalizedTx} finalizedTx transaction
   */
  constructor(finalizedTx) {
    this._envelope = new AppMsgEnvelope(new AppMsg(finalizedTx.getPayload()));
  }

  /**
   * Returns serialized finalized transaction
   * @returns {Object} result
   * @returns {Object} result.PROTOCOL_CHAIN
   * @returns {string} result.MESSAGE
   */
  serialize() {
    return this._envelope.serialize();
  }

  /**
   *
   * Deserialize finalized transaction
   * @param {Object} serialized
   * @param {Object} serialized.PROTOCOL_CHAIN
   * @param {string} serialized.MESSAGE
   * @param {*} TxClass
   * @param {*} chainMetadata
   * @returns {FinalizedTx}
   * @static
   */
  static Deserialize(serialized, TxClass, chainMetadata) {
    const envelope = AppMsgEnvelope.Deserialize(serialized, TxClass, chainMetadata);
    const unwrappedEnvelope = envelope.unwrap();
    return new FinalizedTx(unwrappedEnvelope.tx, unwrappedEnvelope.appCmds);
  }
}

export default FinalizedTxMsg;
