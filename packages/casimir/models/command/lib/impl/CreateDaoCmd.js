import ProtocolEntityCmd from './../base/ProtocolEntityCmd';
import { APP_CMD } from '@deip/constants';
import { assert, isBoolean } from '@deip/toolbox';


class CreateDaoCmd extends ProtocolEntityCmd {

  constructor(cmdPayload) {

    const {
      // onchain
      entityId,
      creator,
      authority,
      description,

      // offchain
      isTeamAccount,
      attributes
    } = cmdPayload;

    assert(!!creator, "'creator' is required");
    assert(!!description, "'description' is required");
    assert(!!authority, "'authority' auths must be set");
    assert(!!authority.owner, "'owner' authority must be set");
    assert(isBoolean(isTeamAccount), "Account must belong to a team or user");

    super(APP_CMD.CREATE_DAO, cmdPayload);
  }

}


export default CreateDaoCmd;
