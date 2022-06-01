import { APP_CMD } from '@deip/constants';
import {
  assert,
  isNumber,
  isString,
  isNumeric
} from '@deip/toolbox';
import ProtocolCmd from '../base/ProtocolCmd';

/**
 * @typedef {import('@casimir/platform-core').FungibleTokenIssueData} FungibleTokenIssueCmdPayload
 */

/**
 * Issue fungible token amount command
 * @extends ProtocolCmd
 */
class IssueFungibleTokenCmd extends ProtocolCmd {
  /**
   * Issue fungible token amount
   * @param {FungibleTokenIssueCmdPayload} cmdPayload
   */
  constructor(cmdPayload) {
    const {
      issuer,
      tokenId,
      amount,
      recipient
    } = cmdPayload;

    assert(!!issuer, "'issuer' is required");
    assert(isNumber(tokenId) || (isString(tokenId) && tokenId),
      "'tokenId' is required and must be a number or non emplty string");
    assert((isNumber(amount) || isNumeric(amount)) && +amount > 0,
      "'amount' is required and must be a number greater than zero");
    assert(!!recipient, "'recipient' is required");

    super(APP_CMD.ISSUE_FT, cmdPayload);
  }
}

export default IssueFungibleTokenCmd;
