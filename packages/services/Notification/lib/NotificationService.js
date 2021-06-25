import { Singleton } from '@deip/toolbox';
import { NotificationHttp } from './NotificationHttp';

class NotificationService extends Singleton {
  notificationHttp = NotificationHttp.getInstance();

  getNotificationsByUser(username) {
    return this.notificationHttp.getNotificationsByUser(username);
  }

  markUserNotificationAsRead(username, notificationId) {
    return this.notificationHttp.markUserNotificationAsRead(username, notificationId);
  }

  markAllUserNotificationAsRead(username) {
    return this.notificationHttp.markAllUserNotificationAsRead(username);
  }
}

export {
  NotificationService
};
