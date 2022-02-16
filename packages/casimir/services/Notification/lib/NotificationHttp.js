import { HttpService } from '@deip/http-service';
import { createInstanceGetter } from '@deip/toolbox';

export class NotificationHttp {
  http = HttpService.getInstance();

  async getListByUser(username) {
    return this.http.get(`/api/v2/notifications/user/${username}`);
  }

  async markUserNotificationsAsRead(req) {
    return this.http.put('/api/v2/notifications/mark-read', req.getHttpBody());
  }

  /** @type {() => NotificationHttp} */
  static getInstance = createInstanceGetter(NotificationHttp);
}
