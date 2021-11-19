import { createInstanceGetter } from '@deip/toolbox';
import { NotificationHttp } from './NotificationHttp';

export class NotificationService {
  notificationHttp = NotificationHttp.getInstance();

  async getNotificationsByUser(username) {
    return this.notificationHttp.getNotificationsByUser(username);
  }

  async markUserNotificationAsRead(username, notificationId) {
    return this.notificationHttp.markUserNotificationAsRead(username, notificationId);
  }

  async markAllUserNotificationAsRead(username) {
    return this.notificationHttp.markAllUserNotificationAsRead(username);
  }

  /** @type {() => NotificationService} */
  static getInstance = createInstanceGetter(NotificationService);
}
