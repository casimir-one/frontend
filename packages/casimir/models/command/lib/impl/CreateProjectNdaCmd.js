import { APP_CMD } from '@deip/constants';
import { assert } from '@deip/toolbox';
import ProtocolEntityCmd from '../base/ProtocolEntityCmd';

/**
 * Create project NDA command
 * @extends ProtocolEntityCmd
 */
class CreateProjectNdaCmd extends ProtocolEntityCmd {
  /**
   * Create command for project NDA creation
   * @param {Object} cmdPayload
   * @param {string} cmdPayload.creator
   * @param {Array.<string>} cmdPayload.parties
   * @param {string} cmdPayload.description
   * @param {string} cmdPayload.projectId
   * @param {number} cmdPayload.startTime
   * @param {number} cmdPayload.endTime
   */
  constructor(cmdPayload) {
    const {
      creator,
      parties,
      description,
      projectId,
      // eslint-disable-next-line no-unused-vars
      startTime,
      endTime
    } = cmdPayload;

    assert(!!creator, "'creator' is required");
    assert(!!parties && Array.isArray(parties) && parties.length > 0, "'parties' is required");
    assert(!!projectId, "'projectId' is required");
    assert(!!description, "'description' is required");
    assert(!!endTime, "'endTime' is required");

    super(APP_CMD.CREATE_PROJECT_NDA, cmdPayload);
  }
}

export default CreateProjectNdaCmd;
