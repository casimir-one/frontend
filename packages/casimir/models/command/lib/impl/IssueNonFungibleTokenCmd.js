import { APP_CMD } from '@deip/constants';
import { assert, isNumber, isString } from '@deip/toolbox';
import ProtocolCmd from '../base/ProtocolCmd';

/**
 * @typedef {import('@casimir/platform-core').NonFungibleTokenCreateData} NonFungibleTokenIssueCmdPayload
 */

/**
 * Issue non-fungible token instance command
 * @extends ProtocolCmd
 */
class IssueNonFungibleTokenCmd extends ProtocolCmd {
  /**
   * Issue non-fungible token instance
   * @param {NonFungibleTokenIssueCmdPayload} cmdPayload
   */
  constructor(cmdPayload) {
    const {
      issuer,
      classId,
      instanceId,
      recipient
    } = cmdPayload;

    assert(!!issuer, "'issuer' is required");
    assert(isNumber(classId) || (isString(classId) && classId),
      "'classId' is required and must be a number or non emplty string");
    assert(isNumber(instanceId) || (isString(instanceId) && instanceId),
      "'instanceId' is required and must be a number or non emplty string");
    assert(!!recipient, "'recipient' is required");

    super(APP_CMD.ISSUE_NFT, cmdPayload);
  }
}

export default IssueNonFungibleTokenCmd;
