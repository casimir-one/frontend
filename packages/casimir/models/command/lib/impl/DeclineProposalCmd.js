import { APP_CMD } from '@deip/constants';
import { assert } from '@deip/toolbox';
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
      account
    } = cmdPayload;

    assert(!!entityId, "'entityId' is required");
    assert(!!account, "'account' is required");

    super(APP_CMD.DECLINE_PROPOSAL, cmdPayload);
  }
}

export default DeclineProposalCmd;
