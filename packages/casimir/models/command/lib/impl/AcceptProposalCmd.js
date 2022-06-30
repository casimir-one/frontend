import { APP_CMD } from '@casimir/platform-core';
import { assert } from '@deip/toolbox';
import ProtocolCmd from '../base/ProtocolCmd';

/**
 * Accept proposal command
 * @extends ProtocolCmd
 */
class AcceptProposalCmd extends ProtocolCmd {
  /**
   * Create command for accepting proposal
   * @param {Object} cmdPayload
   * @param {string} cmdPayload.entityId
   * @param {string} cmdPayload.account
   */
  constructor(cmdPayload) {
    const {
      // onchain
      entityId,
      account,
      batchWeight
    } = cmdPayload;

    assert(!!entityId, "'entityId' is required");
    assert(!!account, "'account' is required");
    assert(!!batchWeight || batchWeight === 0, "'batchWeight' is required");

    super(APP_CMD.ACCEPT_PROPOSAL, cmdPayload);
  }
}

export default AcceptProposalCmd;
