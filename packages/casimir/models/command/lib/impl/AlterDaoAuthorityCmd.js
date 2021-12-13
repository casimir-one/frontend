import ProtocolCmd from './../base/ProtocolCmd';
import { APP_CMD } from '@deip/constants';
import { assert } from '@deip/toolbox';


class AlterDaoAuthorityCmd extends ProtocolCmd {

  constructor(cmdPayload) {

    const {
      entityId,
      authority
    } = cmdPayload;
    
    assert(!!entityId, "'entityId' is required");
    assert(!!authority, "'authority' is required");

    super(APP_CMD.ALTER_DAO_AUTHORITY, cmdPayload);
  }
}


export default AlterDaoAuthorityCmd;
