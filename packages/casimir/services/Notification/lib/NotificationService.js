import { createInstanceGetter } from '@deip/toolbox';
import { JsonDataMsg } from '@deip/messages';
import {
  MarkNotificationsAsReadCmd
} from '@deip/command-models';
import { NotificationHttp } from './NotificationHttp';

export class NotificationService {
  notificationHttp = NotificationHttp.getInstance();

  async getNotificationsByUser(username) {
    return this.notificationHttp.getNotificationsByUser(username);
  }

  async markUserNotificationAsRead(username, notificationId) {
    const markNotificationsAsReadCmd = new MarkNotificationsAsReadCmd({
      username,
      markAll: false,
      notifications: [notificationId]
    });
    const msg = new JsonDataMsg({ appCmds: [markNotificationsAsReadCmd] });
    return this.notificationHttp.markUserNotificationsAsRead(msg);
  }

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
