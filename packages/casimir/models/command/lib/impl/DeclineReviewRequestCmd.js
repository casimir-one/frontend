import { APP_CMD } from '@deip/constants';
import { assert } from '@deip/toolbox';
import AppCmd from '../base/AppCmd';

/**
 * Decline review request command
 * @extends AppCmd
 */
class DeclineReviewRequestCmd extends AppCmd {
  /**
   * Create command for review request rejection
   * @param {Object} cmdPayload
   * @param {string} cmdPayload.reviewRequestId
   */
  constructor(cmdPayload) {
    const {
      reviewRequestId
    } = cmdPayload;

    assert(!!reviewRequestId, "'reviewRequestId' is required");

    super(APP_CMD.DECLINE_REVIEW_REQUEST, cmdPayload);
  }
}

export default DeclineReviewRequestCmd;
