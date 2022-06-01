import { APP_CMD } from '@deip/constants';
import { assert, isNumber, isString } from '@deip/toolbox';
import ProtocolCmd from '../base/ProtocolCmd';

/**
 * Transfer non-fungible token command
 * @extends ProtocolCmd
 */
class TransferNonFungibleTokenCmd extends ProtocolCmd {
  /**
   * Transfer non-fungible token
   * @param {Object} cmdPayload
   * @param {string} cmdPayload.from
   * @param {string} cmdPayload.to
   * @param {string} cmdPayload.classId
   * @param {string} cmdPayload.instanceId
   */
  constructor(cmdPayload) {
    const {
      from,
      to,
      classId,
      instanceId
    } = cmdPayload;

    assert(!!from, "'from' is required");
    assert(!!to, "'to' is required");
    assert(isNumber(classId) || (isString(classId) && classId),
      "'classId' is required and must be a number or non emplty string");
    assert(isNumber(instanceId) || (isString(instanceId) && instanceId),
      "'instanceId' is required and must be a number or non emplty string");

    super(APP_CMD.TRANSFER_NFT, cmdPayload);
  }
}

export default TransferNonFungibleTokenCmd;
