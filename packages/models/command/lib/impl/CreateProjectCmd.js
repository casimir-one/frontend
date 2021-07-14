import ProtocolEntityCmd from './../base/ProtocolEntityCmd';
import { APP_CMD } from '@deip/constants';
import { assert } from '@deip/toolbox';


class CreateProjectCmd extends ProtocolEntityCmd {

  constructor(cmdPayload) {

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
    assert(!!domains, "'domains' list is required");

    super(APP_CMD.CREATE_PROJECT, cmdPayload);
  }

}


export default CreateProjectCmd;
