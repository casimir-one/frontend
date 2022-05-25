/* eslint-disable no-unused-vars */
import { APP_CMD } from '@deip/constants';
import { assert } from '@deip/toolbox';
import ProtocolEntityCmd from '../base/ProtocolEntityCmd';

/**
 * Creates portal (network gateway) for tenant
 * @extends ProtocolEntityCmd
 */
class CreatePortalCmd extends ProtocolEntityCmd {
  /**
   * Create command for portal creation
   * @param {Object} cmdPayload
   * @param {string} cmdPayload.owner
   * @param {string} cmdPayload.verificationPubKey
   * @param {string} cmdPayload.metadata
   */
  constructor(cmdPayload) {
    const {
      owner,
      verificationPubKey,
      metadata
    } = cmdPayload;

    assert(!!owner, "'owner' is required");
    assert(!!verificationPubKey, "'verificationPubKey' is required");

    super(APP_CMD.CREATE_PORTAL, cmdPayload);
  }
}

export default CreatePortalCmd;
