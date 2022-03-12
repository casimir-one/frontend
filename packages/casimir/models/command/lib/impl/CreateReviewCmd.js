import { APP_CMD } from '@deip/constants';
import { assert } from '@deip/toolbox';
import ProtocolEntityCmd from '../base/ProtocolEntityCmd';

/**
 * Create review command
 * @extends ProtocolEntityCmd
 */
class CreateReviewCmd extends ProtocolEntityCmd {
  /**
   * Create command for project content review creation
   * @param {Object} cmdPayload
   * @param {string} cmdPayload.author
   * @param {string} cmdPayload.projectContentId
   * @param {string} cmdPayload.content
   * @param {string} cmdPayload.contentHash
   * @param {Object} cmdPayload.assessment
   * @param {Object} cmdPayload.assessment.scores
   * @param {number} cmdPayload.assessment.type
   * @param {boolean} cmdPayload.assessment.isPositive
   * @param {Array.<string>} cmdPayload.domains
   */
  constructor(cmdPayload) {
    const {
      author,
      projectContentId,
      content,
      contentHash,
      assessment,
      domains
    } = cmdPayload;

    assert(!!author, "'author' is required");
    assert(!!projectContentId, "'projectContentId' is required");
    assert(!!content, "'content' is required");
    assert(!!contentHash, "'contentHash' is required");
    assert(!!domains, "'domains' is required");
    assert(!!assessment, "'assessment' is required");

    super(APP_CMD.CREATE_REVIEW, cmdPayload);
  }
}

export default CreateReviewCmd;
