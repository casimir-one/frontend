import { APP_CMD } from '@deip/constants';
import { assert, isNumber, isString } from '@deip/toolbox';
import ProtocolCmd from '../base/ProtocolCmd';

/**
 * Transfer fungible token command
 * @extends ProtocolCmd
 */
class TransferFungibleTokenCmd extends ProtocolCmd {
  /**
   * Transfer fungible token
   * @param {Object} cmdPayload
   * @param {string} cmdPayload.from
   * @param {string} cmdPayload.to
   * @param {string} cmdPayload.tokenId
   * @param {string} cmdPayload.amount
   */
  constructor(cmdPayload) {
    const {
      from,
      to,
      tokenId,
      amount
    } = cmdPayload;

    assert(!!from, "'from' is required");
    assert(!!to, "'to' is required");
    assert(isNumber(tokenId) || isString(tokenId), "FT 'tokenId' is required");
    assert(isNumber(amount) || isString(amount), "FT 'amount' is required");

    super(APP_CMD.TRANSFER_FT, cmdPayload);
  }
}

export default TransferFungibleTokenCmd;
