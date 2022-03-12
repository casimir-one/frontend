import { APP_CMD } from '@deip/constants';
import { assert } from '@deip/toolbox';
import AppCmd from '../base/AppCmd';

/**
 * Create review request command
 * @extends AppCmd
 */
class CreateReviewRequestCmd extends AppCmd {
  /**
   * Create command for review request creation
   * @param {Object} cmdPayload
   * @param {string} cmdPayload.projectContentId
   * @param {string} cmdPayload.expert
   */
  constructor(cmdPayload) {
    const {
      projectContentId,
      expert
    } = cmdPayload;

    assert(!!projectContentId, "'projectContentId' is required");
    assert(!!expert, "'expert' is required");

    super(APP_CMD.CREATE_REVIEW_REQUEST, cmdPayload);
  }
}

export default CreateReviewRequestCmd;
