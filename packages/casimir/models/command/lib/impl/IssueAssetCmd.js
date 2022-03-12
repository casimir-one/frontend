import { APP_CMD } from '@deip/constants';
import { assert } from '@deip/toolbox';
import ProtocolCmd from '../base/ProtocolCmd';

/**
 * @typedef {{ id: string, symbol: string, amount: string, precision: number}} Asset
 */

/**
 * Issue asset command
 * @extends ProtocolCmd
 */
class IssueAssetCmd extends ProtocolCmd {
  /**
   * Create command for asset issue
   * @param {Object} cmdPayload
   * @param {Asset} cmdPayload.asset
   * @param {string} cmdPayload.recipient
   * @param {*} cmdPayload.memo
   */
  constructor(cmdPayload) {
    const {
      issuer,
      asset,
      recipient,
      // eslint-disable-next-line no-unused-vars
      memo
    } = cmdPayload;

    assert(!!issuer, "'issuer' is required");
    assert(
      !!asset
      && asset.id
      && asset.symbol
      && !Number.isNaN(asset.precision)
      && asset.amount,
      "'asset' is required and should contains 'id', 'symbol', 'precision', 'amount' fields"
    );
    assert(!!recipient, "'recipient' is required");

    super(APP_CMD.ISSUE_ASSET, cmdPayload);
  }
}

export default IssueAssetCmd;
