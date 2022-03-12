import { APP_CMD } from '@deip/constants';
import { assert } from '@deip/toolbox';
import ProtocolEntityCmd from '../base/ProtocolEntityCmd';

/**
 * Upvote review command
 * @extends ProtocolEntityCmd
 */
class UpvoteReviewCmd extends ProtocolEntityCmd {
  /**
   * Create command for review upvoting
   * @param {Object} cmdPayload
   * @param {string} cmdPayload.voter
   * @param {string} cmdPayload.reviewId
   * @param {string} cmdPayload.domainId
   * @param {string} cmdPayload.weight
   */
  constructor(cmdPayload) {
    const {
      voter,
      reviewId,
      domainId,
      // eslint-disable-next-line no-unused-vars
      weight
    } = cmdPayload;

    assert(!!voter, "'voter' is required");
    assert(!!reviewId, "'reviewId' is required");
    assert(!!domainId, "'domainId' is required");

    super(APP_CMD.UPVOTE_REVIEW, cmdPayload);
  }
}

export default UpvoteReviewCmd;
