import ProtocolEntityCmd from './../base/ProtocolEntityCmd';
import { APP_CMD } from '@deip/constants';
import { assert } from '@deip/toolbox';


class UpvoteReviewCmd extends ProtocolEntityCmd {

  constructor(cmdPayload) {

    const {
      voter,
      reviewId,
      domainId,
      weight
    } = cmdPayload;

    assert(!!voter, "'voter' is required");
    assert(!!reviewId, "'reviewId' is required");
    assert(!!domainId, "'domainId' is required");

    super(APP_CMD.UPVOTE_REVIEW, cmdPayload);
  }

}

export default UpvoteReviewCmd;
