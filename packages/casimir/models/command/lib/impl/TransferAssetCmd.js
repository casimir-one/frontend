import { APP_CMD } from '@deip/constants';
import { assert } from '@deip/toolbox';
import ProtocolCmd from '../base/ProtocolCmd';

/**
 * @typedef {{ id: string, symbol: string, amount: string, precision: number}} Asset
 */

/**
 * Transfer asset command
 * @extends ProtocolCmd
 */
class TransferAssetCmd extends ProtocolCmd {
  /**
   *
   * @param {Object} cmdPayload
   * @param {string} cmdPayload.from
   * @param {string} cmdPayload.to
   * @param {Asset} cmdPayload.asset
   */
  constructor(cmdPayload) {
    const {
      from,
      to,
      asset
    } = cmdPayload;

    assert(!!from, "'from' is required");
    assert(!!to, "'to' is required");
    assert(
      !!asset
      && asset.id
      && asset.symbol
      && !Number.isNaN(asset.precision)
      && asset.amount,
      "'asset' is required and should contains 'id', 'symbol', 'precision', 'amount' fields"
    );

    super(APP_CMD.TRANSFER_ASSET, cmdPayload);
  }
}

export default TransferAssetCmd;
