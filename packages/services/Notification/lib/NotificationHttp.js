import { HttpService } from '@deip/http-service';
import { createInstanceGetter } from '@deip/toolbox';

export class NotificationHttp {
  http = HttpService.getInstance();

  async getNotificationsByUser(username) {
    return this.http.get(`/api/notifications/user/${username}`);
  }

  async markUserNotificationAsRead(username, notificationId) {
    return this.http.put(`/api/notifications/${username}/mark-read/${notificationId}`, {});
  }

  async markAllUserNotificationAsRead(username) {
    return this.http.put(`/api/notifications/${username}/mark-all-read`, {});
  }

  /** @type {() => NotificationHttp} */
  static getInstance = createInstanceGetter(NotificationHttp);
}
