import { APP_CMD } from '@deip/constants';
import { assert } from '@deip/toolbox';
import ProtocolCmd from '../base/ProtocolCmd';

/**
 * Issue non-fungible token instance command
 * @extends ProtocolCmd
 */
class IssueNonFungibleTokenCmd extends ProtocolCmd {
  /**
   * Issue non-fungible token instance
   * @param {Object} cmdPayload
   * @param {string} cmdPayload.issuer
   * @param {string} cmdPayload.classId
   * @param {number} cmdPayload.instanceId
   * @param {string} cmdPayload.recipient
   */
  constructor(cmdPayload) {
    const {
      issuer,
      classId,
      instanceId,
      recipient
    } = cmdPayload;

    assert(!!issuer, "'issuer' is required");
    assert(!!classId, "'classId' is required");
    assert(!!instanceId && !Number.isNaN(instanceId), "'instanceId' is required");
    assert(!!recipient, "'recipient' is required");

    super(APP_CMD.ISSUE_NFT, cmdPayload);
  }
}

export default IssueNonFungibleTokenCmd;
