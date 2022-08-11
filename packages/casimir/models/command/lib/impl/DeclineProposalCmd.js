import { APP_CMD } from '@casimir/platform-core';
import { assert } from '@casimir/toolbox';
import ProtocolCmd from '../base/ProtocolCmd';

/**
 * Decline proposal command
 * @extends ProtocolCmd
 */
class DeclineProposalCmd extends ProtocolCmd {
  /**
   * Create command for proposal rejection
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

    super(APP_CMD.DECLINE_PROPOSAL, cmdPayload);
  }
}

export default DeclineProposalCmd;
