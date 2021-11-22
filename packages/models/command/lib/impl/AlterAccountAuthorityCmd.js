import ProtocolCmd from './../base/ProtocolCmd';
import { APP_CMD } from '@deip/constants';
import { assert, isBoolean } from '@deip/toolbox';


class AlterAccountAuthorityCmd extends ProtocolCmd {

  constructor(cmdPayload) {

    const {
      entityId,
      ownerAuth,
      isTeamAccount
    } = cmdPayload;
    
    assert(!!entityId, "'entityId' is required");
    assert(!!ownerAuth, "'ownerAuth' is required");
    assert(isBoolean(isTeamAccount), "Account must belong to a team or user");

    super(APP_CMD.ALTER_ACCOUNT_AUTHORITY, cmdPayload);
  }
}


export default AlterAccountAuthorityCmd;
