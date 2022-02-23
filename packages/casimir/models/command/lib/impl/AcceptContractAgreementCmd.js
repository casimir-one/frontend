import { APP_CMD } from '@deip/constants';
import { assert } from '@deip/toolbox';
import ProtocolCmd from '../base/ProtocolCmd';

/**
 * Accept contract agreement command
 * @extends ProtocolCmd
 */
class AcceptContractAgreementCmd extends ProtocolCmd {
  /**
   * Create command for acceprting contract agreement
   * @param {Object} cmdPayload
   * @param {string} cmdPayload.entityId
   * @param {party} cmdPayload.party
   */
  constructor(cmdPayload) {
    const {
      entityId,
      party
    } = cmdPayload;

    assert(!!entityId, "'entityId' is required");
    assert(!!party, "'party' is required");

    super(APP_CMD.ACCEPT_CONTRACT_AGREEMENT, cmdPayload);
  }
}

export default AcceptContractAgreementCmd;
