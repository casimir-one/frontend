import { makeSingletonInstance } from '@deip/toolbox';
import { JsonDataMsg } from '@deip/messages';
import {
  MarkNotificationsAsReadCmd
} from '@deip/commands';
import { proxydi } from '@deip/proxydi';
import { NotificationHttp } from './NotificationHttp';

/**
 * Notification data transport
 */
export class NotificationService {
  notificationHttp = NotificationHttp.getInstance();
  proxydi = proxydi;

  /**
   * Get notifications by username
   * @param {string} username
   * @returns {Promise<Object>}
   */
  async getListByUser(username) {
    return this.notificationHttp.getListByUser(username);
  }

  /**
   * Mark user notification as read
   * @param {string} username
   * @param {string} notificationId
   * @returns {Promise<Object>}
   */
  async markUserNotificationAsRead(username, notificationId) {
    const markNotificationsAsReadCmd = new MarkNotificationsAsReadCmd({
      username,
      markAll: false,
      notifications: [notificationId]
    });
    const msg = new JsonDataMsg({ appCmds: [markNotificationsAsReadCmd] });
    const env = this.proxydi.get('env');

    if (env.RETURN_MSG === true) {
      return msg;
    }

    return this.notificationHttp.markUserNotificationsAsRead(msg);
  }

  /**
   * Mark all user notifications as read
   * @param {string} username
   * @returns {Promise<Object>}
   */
  async markAllUserNotificationAsRead(username) {
    const markNotificationsAsReadCmd = new MarkNotificationsAsReadCmd({
      username,
      markAll: true,
      notifications: []
    });
    const msg = new JsonDataMsg({ appCmds: [markNotificationsAsReadCmd] });
    const env = this.proxydi.get('env');

    if (env.RETURN_MSG === true) {
      return msg;
    }

    return this.notificationHttp.markUserNotificationsAsRead(msg);
  }

  /** @type {() => NotificationService} */
  static getInstance = makeSingletonInstance(() => new NotificationService());
}
