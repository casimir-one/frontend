import { APP_CMD } from '@deip/constants';
import { assert } from '@deip/toolbox';
import AppCmd from '../base/AppCmd';

/**
 * Mark notifications as read command
 * @extends AppCmd
 */
class MarkNotificationsAsReadCmd extends AppCmd {
  /**
   * Create command for mark notifications as read
   * @param {Object} cmdPayload
   * @param {string} cmdPayload.username
   * @param {boolean} cmdPayload.markAll
   * @param {Array.<string>} cmdPayload.notifications
   */
  constructor(cmdPayload) {
    const {
      username,
      markAll,
      notifications
    } = cmdPayload;

    assert(!!username, "'username' is required");
    assert(markAll || (!!notifications && Array.isArray(notifications) && notifications.length),
      "if 'markAll' is false, 'notifications' is required");

    super(APP_CMD.MARK_NOTIFICATIONS_AS_READ, cmdPayload);
  }
}

export default MarkNotificationsAsReadCmd;
