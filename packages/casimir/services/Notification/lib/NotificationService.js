import { createInstanceGetter } from '@deip/toolbox';
import { JsonDataMsg } from '@deip/messages';
import {
  MarkNotificationsAsReadCmd
} from '@deip/commands';
import { NotificationHttp } from './NotificationHttp';

/**
 * Notification data transport
 */
export class NotificationService {
  notificationHttp = NotificationHttp.getInstance();

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
    return this.notificationHttp.markUserNotificationsAsRead(msg);
  }

  /** @type {() => NotificationService} */
  static getInstance = createInstanceGetter(NotificationService);
}
