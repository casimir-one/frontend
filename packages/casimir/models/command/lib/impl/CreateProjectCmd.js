/* eslint-disable no-unused-vars */
import { APP_CMD } from '@deip/constants';
import { assert } from '@deip/toolbox';
import ProtocolEntityCmd from '../base/ProtocolEntityCmd';

/**
 * Create project command
 * @extends ProtocolEntityCmd
 */
class CreateProjectCmd extends ProtocolEntityCmd {
  /**
   * Create command for project creation
   * @param {Object} cmdPayload
   * @param {string} cmdPayload.teamId
   * @param {string} cmdPayload.description
   * @param {Array.<string>} cmdPayload.domains
   * @param {Array.<string>} cmdPayload.members
   * @param {Array.<Object>} cmdPayload.attributes
   * @param {boolean} cmdPayload.isPrivate
   */
  constructor(cmdPayload) {
    const {
      // onchain
      entityId, // ?
      teamId,
      description,
      domains,
      isPrivate,
      members,
      reviewShare, // ?
      compensationShare, // ?

      // offchain
      attributes
    } = cmdPayload;

    assert(!!teamId, "'teamId' is required");
    assert(!!description, "'description' is required");
    assert(!!domains, "'domains' list is required");

    super(APP_CMD.CREATE_PROJECT, cmdPayload);
  }
}

export default CreateProjectCmd;
