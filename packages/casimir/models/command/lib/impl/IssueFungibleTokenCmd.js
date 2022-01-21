import { APP_CMD } from '@deip/constants';
import { assert } from '@deip/toolbox';
import ProtocolCmd from '../base/ProtocolCmd';

/**
 * Issue fungible token amount command
 * @extends ProtocolCmd
 */
class IssueFungibleTokenCmd extends ProtocolCmd {
  /**
   * Issue fungible token amount
   * @param {Object} cmdPayload
   * @param {string} cmdPayload.issuer
   * @param {string} cmdPayload.tokenId
   * @param {string} cmdPayload.symbol
   * @param {number} cmdPayload.precision
   * @param {number} cmdPayload.amount
   * @param {string} cmdPayload.recipient
   */
  constructor(cmdPayload) {
    const {
      issuer,
      tokenId,
      symbol,
      precision,
      amount,
      recipient
    } = cmdPayload;

    assert(!!issuer, "FT 'issuer' is required");
    assert(!!tokenId, "FT 'tokenId' is required");
    assert(!!symbol, "FT 'symbol' is required");
    assert(!Number.isNaN(precision), "FT 'precision' is required");
    assert(!!amount, "FT 'amount' is required");
    assert(!!recipient, "'recipient' is required");

    super(APP_CMD.ISSUE_FT, cmdPayload);
  }
}

export default IssueFungibleTokenCmd;
