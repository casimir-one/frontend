import { APP_CMD } from '@deip/constants';
import { assert } from '@deip/toolbox';
import ProtocolCmd from '../base/ProtocolCmd';

/**
 * Update project command
 */
class UpdateProjectCmd extends ProtocolCmd {
  /**
   * Create command for project update
   * @param {Object} cmdPayload
   * @param {string} cmdPayload.entityId
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
      entityId,
      teamId,
      description,

      // offchain
      // eslint-disable-next-line no-unused-vars
      attributes
    } = cmdPayload;

    assert(!!entityId, "'entityId' is required");
    assert(!!teamId, "'teamId' is required");
    assert(!!description, "'description' is required");

    super(APP_CMD.UPDATE_PROJECT, cmdPayload);
  }
}

export default UpdateProjectCmd;
