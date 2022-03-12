/* eslint-disable no-unused-vars */
import { APP_CMD } from '@deip/constants';
import { assert } from '@deip/toolbox';
import ProtocolEntityCmd from '../base/ProtocolEntityCmd';

/**
 * @typedef {{ id: string, symbol: string, amount: string, precision: number}} Asset
 */

/**
 * Create investment opportunity command
 * @extends ProtocolEntityCmd
 */
class CreateInvestmentOpportunityCmd extends ProtocolEntityCmd {
  /**
   * Create command for investment opportunity creation
   * @param {Object} cmdPayload
   * @param {string} cmdPayload.teamId
   * @param {string} cmdPayload.projectId
   * @param {number} cmdPayload.startTime
   * @param {number} cmdPayload.endTime
   * @param {Array.<Asset>} cmdPayload.shares
   * @param {Asset} cmdPayload.softCap
   * @param {Asset} cmdPayload.hardCap
   * @param {string} cmdPayload.title
   * @param {Object} cmdPayload.metadata
   */
  constructor(cmdPayload) {
    const {
      entityId,
      teamId,
      projectId,
      startTime,
      endTime,
      shares,
      softCap,
      hardCap,
      title,
      metadata
    } = cmdPayload;

    const checkAsset = (asset, fieldName) => assert(
      !!asset
      && asset.id
      && asset.symbol
      && !Number.isNaN(asset.precision)
      && asset.amount,
      `'${fieldName}' is required and should contains 'id', 'symbol', 'precision', 'amount' fields`
    );

    assert(!!teamId, "'teamId' is required");
    assert(!!startTime && !Number.isNaN(startTime), "'startTime' required and should be in milliseconds");
    assert(!!endTime && !Number.isNaN(endTime), "'endTime' required and should be in milliseconds");
    assert(new Date(endTime) > new Date(startTime), "'endTime' must be greater than 'startTime'");
    assert(!!shares && Array.isArray(shares), "'shares' is required and must be an array");
    shares.forEach((share) => {
      checkAsset(share, 'share');
    });
    checkAsset(softCap, 'softCap');
    checkAsset(hardCap, 'hardCap');

    super(APP_CMD.CREATE_INVESTMENT_OPPORTUNITY, cmdPayload);
  }
}

export default CreateInvestmentOpportunityCmd;
