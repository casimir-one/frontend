import ProtocolEntityCmd from './../base/ProtocolEntityCmd';
import { APP_CMD } from './../constants';
import { assert } from '@deip/toolbox';


class CreateProjectCmd extends ProtocolEntityCmd {

  constructor(cmdPayload, txContext) {

    const {
      // onchain
      entityId,
      teamId,
      description,
      domains,
      isPrivate,
      members,
      reviewShare,
      compensationShare,

      // offchain
      attributes
    } = cmdPayload;

    assert(!!teamId, "'teamId' is required");
    assert(!!description, "'description' is required");
    assert(!!domains && domains.length, "'domains' list is required");

    super(APP_CMD.CREATE_PROJECT, cmdPayload, txContext);
  }


  getProtocolEntityId() {
    const [opName, { external_id: projectId }] = this.getProtocolOp();
    return projectId;
  }

}


export default CreateProjectCmd;


