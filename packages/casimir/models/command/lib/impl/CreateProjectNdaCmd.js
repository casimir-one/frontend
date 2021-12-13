import ProtocolEntityCmd from '../base/ProtocolEntityCmd';
import { APP_CMD } from '@deip/constants';
import { assert } from '@deip/toolbox';

class CreateProjectNdaCmd extends ProtocolEntityCmd {

  constructor(cmdPayload) {

    const {
      creator,
      parties,
      description,
      projectId,
      startTime,
      endTime
    } = cmdPayload;

    assert(!!creator, "'creator' is required");
    assert(!!parties && Array.isArray(parties) && parties.length > 0, "'parties' is required");
    assert(!!projectId, "'projectId' is required");
    assert(!!description, "'description' is required");
    assert(!!endTime, "'endTime' is required");

    super(APP_CMD.CREATE_PROJECT_NDA, cmdPayload);
  }

}

export default CreateProjectNdaCmd;
