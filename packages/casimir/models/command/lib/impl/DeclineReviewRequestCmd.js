import AppCmd from './../base/AppCmd';
import { APP_CMD } from '@deip/constants';
import { assert } from '@deip/toolbox';

class DeclineReviewRequestCmd extends AppCmd {

  constructor(cmdPayload) {

    const {
      reviewRequestId
    } = cmdPayload;

    assert(!!reviewRequestId, "'reviewRequestId' is required");

    super(APP_CMD.DECLINE_REVIEW_REQUEST, cmdPayload);
  }

}

export default DeclineReviewRequestCmd;
