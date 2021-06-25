import { HttpService } from '@deip/http-service';
import { Singleton } from '@deip/toolbox';

class NotificationHttp extends Singleton {
  http = HttpService.getInstance();

  getNotificationsByUser(username) {
    return this.http.get(`/api/notifications/user/${username}`);
  }

  markUserNotificationAsRead(username, notificationId) {
    return this.http.put(`/api/notifications/${username}/mark-read/${notificationId}`, {});
  }

  markAllUserNotificationAsRead(username) {
    return this.http.put(`/api/notifications/${username}/mark-all-read`, {});
  }
}

export {
  NotificationHttp
};
