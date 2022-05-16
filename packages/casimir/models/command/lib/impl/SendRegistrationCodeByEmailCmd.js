import { APP_CMD } from '@deip/constants';
import { assert } from '@deip/toolbox';
import AppCmd from '../base/AppCmd';

/**
 * Send registration code by email command
 * @extends AppCmd
 */
class SendRegistrationCodeByEmailCmd extends AppCmd {
  /**
   * Create command for send registration code by email
   * @param {Object} cmdPayload
   * @param {string} cmdPayload.email
   */
  constructor(cmdPayload) {
    const {
      email
    } = cmdPayload;

    assert(!!email, "'email' is required");

    super(APP_CMD.SEND_REGISTRATION_CODE_BY_EMAIL, cmdPayload);
  }
}

export default SendRegistrationCodeByEmailCmd;
