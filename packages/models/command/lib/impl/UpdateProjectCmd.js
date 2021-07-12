import ProtocolCmd from './../base/ProtocolCmd';
import { APP_CMD } from '@deip/constants';
import { assert } from '@deip/toolbox';


class UpdateProjectCmd extends ProtocolCmd {

  constructor(cmdPayload) {

    const {
      // onchain
      entityId,
      teamId,
      description,

      // offchain
      attributes
    } = cmdPayload;

    assert(!!entityId, "'entityId' is required");
    assert(!!teamId, "'teamId' is required");
    assert(!!description, "'description' is required");

    super(APP_CMD.UPDATE_PROJECT, cmdPayload);
  }
}


export default UpdateProjectCmd;
