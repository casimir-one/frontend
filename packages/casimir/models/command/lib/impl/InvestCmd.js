import { APP_CMD } from '@casimir.one/platform-core';
import { assert } from '@casimir.one/toolbox';
import ProtocolCmd from '../base/ProtocolCmd';

/**
 * @typedef {{ id: string, symbol: string, amount: string, precision: number}} Asset
 */

/**
 * Invest command
 * @extends ProtocolCmd
 */
class InvestCmd extends ProtocolCmd {
  /**
   * Create command for investment
   * @param {Object} cmdPayload
   * @param {string} cmdPayload.investmentOpportunityId
   * @param {string} cmdPayload.investor
   * @param {Asset} cmdPayload.asset
   */
  constructor(cmdPayload) {
    const {
      investmentOpportunityId,
      investor,
      asset
    } = cmdPayload;

    assert(!!investmentOpportunityId, "'investmentOpportunityId' is required");
    assert(!!investor, "'investor' is required");
    assert(
      !!asset
      && asset.id
      && asset.symbol
      && !Number.isNaN(asset.precision)
      && asset.amount,
      "'asset' is required and should contains 'id', 'symbol', 'precision', 'amount' fields"
    );

    super(APP_CMD.INVEST, cmdPayload);
  }
}

export default InvestCmd;
