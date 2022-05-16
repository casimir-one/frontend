import { APP_CMD } from '@deip/constants';
import { assert } from '@deip/toolbox';
import ProtocolEntityCmd from '../base/ProtocolEntityCmd';

/**
 * Create project content command
 * @extends ProtocolEntityCmd
 */
class CreateProjectContentCmd extends ProtocolEntityCmd {
  /**
   * Create command for project content creation
   * @param {Object} cmdPayload
   * @param {string} cmdPayload.projectId
   * @param {string} cmdPayload.teamId
   * @param {string} cmdPayload.title
   * @param {number} cmdPayload.contentType
   * @param {string} cmdPayload.content
   * @param {string} cmdPayload.description
   * @param {Array.<string>} cmdPayload.authors
   * @param {Array.<string>} cmdPayload.references
   * @param {Object} cmdPayload.metadata
   */
  constructor(cmdPayload) {
    const {
      // onchain
      projectId,
      teamId,
      description,
      content,
      authors,
      // eslint-disable-next-line no-unused-vars
      references,

      // offchain
      // eslint-disable-next-line no-unused-vars
      title
    } = cmdPayload;

    assert(!!projectId, "'projectId' is required");
    assert(!!teamId, "'teamId' is required");
    assert(!!description, "'description' is required");
    assert(!!content, "'content' is required");
    assert(!!authors && authors.length, "'authors' is required");

    super(APP_CMD.CREATE_PROJECT_CONTENT, cmdPayload);
  }
}

export default CreateProjectContentCmd;
