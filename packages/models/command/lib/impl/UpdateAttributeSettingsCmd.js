import AppCmd from './../base/AppCmd';
import { APP_CMD } from '@deip/constants';
import { assert } from '@deip/toolbox';

class UpdateAttributeSettingsCmd extends AppCmd {

  constructor(cmdPayload) {

    const attributeSettings = cmdPayload;

    assert(!!attributeSettings, "'attributeSettings' is required");

    super(APP_CMD.UPDATE_ATTRIBUTE_SETTINGS, cmdPayload);
  }

}

export default UpdateAttributeSettingsCmd;
