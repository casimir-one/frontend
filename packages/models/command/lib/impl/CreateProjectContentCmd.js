import ProtocolEntityCmd from './../base/ProtocolEntityCmd';
import { APP_CMD } from '@deip/constants';
import { assert } from '@deip/toolbox';


class CreateProjectContentCmd extends ProtocolEntityCmd {

  constructor(cmdPayload) {

    const {
      // onchain
      projectId,
      teamId,
      type,
      description,
      content,
      authors,
      references,

      // offchain
      title
    } = cmdPayload;

    assert(!!projectId, "'projectId' is required");
    assert(!!teamId, "'teamId' is required");
    assert(!!description, "'description' is required");
    assert(!!content, "'content' is required");
    assert(!!type, "'type' is required");
    assert(!!authors && authors.length, "'authors' is required");
    assert(!!title, "'title' is required");

    super(APP_CMD.CREATE_PROJECT_CONTENT, cmdPayload);
  }

}


export default CreateProjectContentCmd;
