import { APP_CMD } from '@deip/constants';
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
      account
    } = cmdPayload;

    assert(!!entityId, "'entityId' is required");
    assert(!!account, "'account' is required");

    super(APP_CMD.ACCEPT_PROPOSAL, cmdPayload);
  }
}

export default AcceptProposalCmd;
