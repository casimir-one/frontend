import ProtocolEntityCmd from './../base/ProtocolEntityCmd';
import { APP_CMD } from '@deip/constants';
import { assert } from '@deip/toolbox';

class CreateReviewCmd extends ProtocolEntityCmd {

  constructor(cmdPayload) {

    const {
      author,
      projectContentId,
      content,
      weight,
      assessment,
      disciplines
    } = cmdPayload;

    assert(!!author, "'author' is required");
    assert(!!projectContentId, "'projectContentId' is required");
    assert(!!content, "'content' is required");
    assert(!!disciplines, "'disciplines' is required");

    super(APP_CMD.CREATE_REVIEW, cmdPayload);
  }

}

export default CreateReviewCmd;
