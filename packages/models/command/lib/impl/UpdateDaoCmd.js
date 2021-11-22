import ProtocolCmd from './../base/ProtocolCmd';
import { APP_CMD } from '@deip/constants';
import { assert, isBoolean } from '@deip/toolbox';


class UpdateDaoCmd extends ProtocolCmd {

  constructor(cmdPayload) {

    const {
      // onchain
      entityId,
      description,

      // offchain
      isTeamAccount,
      attributes,
    } = cmdPayload;

    assert(!!description, "'description' is required");
    assert(!!entityId, "'entityId' is required");
    assert(isBoolean(isTeamAccount), "Account must belong to a team or user");

    super(APP_CMD.UPDATE_DAO, cmdPayload);
  }
}


export default UpdateDaoCmd;
