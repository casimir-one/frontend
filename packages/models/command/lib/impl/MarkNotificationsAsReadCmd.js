import AppCmd from '../base/AppCmd';
import { APP_CMD } from '@deip/constants';
import { assert } from '@deip/toolbox';

class MarkNotificationsAsReadCmd extends AppCmd {

  constructor(cmdPayload) {
    const {
      username,
      markAll,
      notifications
    } = cmdPayload;

    assert(!!username, "'username' is required");
    assert(markAll ? markAll : (!!notifications && Array.isArray(notifications) && notifications.length),
    "if 'markAll' is false, 'notifications' is required");

    super(APP_CMD.MARK_NOTIFICATIONS_AS_READ, cmdPayload);
  }

}

export default MarkNotificationsAsReadCmd;
