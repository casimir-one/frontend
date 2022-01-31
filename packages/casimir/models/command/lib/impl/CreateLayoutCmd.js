import AppCmd from '../base/AppCmd';
import { APP_CMD, ATTR_SCOPES } from '@deip/constants';
import { assert, isArray } from '@deip/toolbox';

class CreateLayoutCmd extends AppCmd {

  constructor(cmdPayload) {
    const {
      name,
      value,
      scope,
      type
    } = cmdPayload

    assert(!!name, "'name' is required");
    assert(!!value && isArray(value), "'value' is required and should be an aray");
    assert(!!scope && ATTR_SCOPES.includes(scope), "'scope' is required and should be from 'ATTR_SCOPES'");
    assert(!!type, "'type' is required");

    super(APP_CMD.CREATE_LAYOUT, cmdPayload);
  }

}

export default CreateLayoutCmd;
