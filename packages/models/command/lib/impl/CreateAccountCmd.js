import ProtocolEntityCmd from './../base/ProtocolEntityCmd';
import { APP_CMD } from '@deip/constants';
import { assert, isBoolean } from '@deip/toolbox';


class CreateAccountCmd extends ProtocolEntityCmd {

  constructor(cmdPayload) {

    const {
      // onchain
      entityId,
      fee,
      creator,
      authority,
      memoKey,
      description,

      // offchain
      isTeamAccount,
      attributes
    } = cmdPayload;

    assert(!!fee, "'fee' is required");
    assert(!!creator, "'creator' is required");
    assert(!!description, "'description' is required");
    assert(!!authority, "'authority' auths must be set");
    assert(!!authority.owner || !!authority.active, "'owner' or 'active' authority must be set");
    assert(!!memoKey, "'memoKey' is required");
    assert(isBoolean(isTeamAccount), "Account must belong to a team or user");

    super(APP_CMD.CREATE_ACCOUNT, cmdPayload);
  }

}


export default CreateAccountCmd;
