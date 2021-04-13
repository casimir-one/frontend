import ProtocolEntityCmd from './base/ProtocolEntityCmd';
import { APP_CMD } from './../constants';
import { assert } from '@deip/toolbox';


class CreateProjectCmd extends ProtocolEntityCmd {

  constructor(cmdPayload, txContext) {

    const {
      // onchain
      teamId,
      description,
      domains,
      isPrivate,
      members,
      reviewShare,
      compensationShare,
      extensions,

      // offchain
      attributes
    } = cmdPayload;

    assert(!!teamId, "Team ID is required");
    assert(!!description, "Project description is required");
    assert(!!domains && domains.length, "Project domain is required");

    // TODO: validate others

    super(APP_CMD.CREATE_PROJECT, cmdPayload, txContext);
  }


  getProtocolEntityId() {
    const [opName, { external_id: projectId }] = this.getProtocolOp();
    return projectId;
  }

}


export default CreateProjectCmd;