import ProtocolEntityCmd from './../base/ProtocolEntityCmd';
import { APP_CMD } from '@deip/constants';
import { assert } from '@deip/toolbox';

class UpvoteReviewCmd extends ProtocolEntityCmd {

  constructor(cmdPayload) {

    const {
      voter,
      reviewId,
      disciplineId,
      weight
    } = cmdPayload;

    assert(!!voter, "'voter' is required");
    assert(!!reviewId, "'reviewId' is required");
    assert(!!disciplineId, "'disciplineId' is required");

    super(APP_CMD.UPVOTE_REVIEW, cmdPayload);
  }

}

export default UpvoteReviewCmd;
