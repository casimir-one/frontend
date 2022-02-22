import { HttpService } from '@deip/http-service';
import { createInstanceGetter } from '@deip/toolbox';

/**
 * Notification HTTP transport
 */
export class NotificationHttp {
  http = HttpService.getInstance();

  /**
   * Get notifications by username
   * @param {string} username
   * @returns {Promise<Object>}
   */
  async getListByUser(username) {
    return this.http.get(`/api/v2/notifications/user/${username}`);
  }

  /**
   * Mark user notifications as read
   * @param {Object} req
   * @returns {Promise<Object>}
   */
  async markUserNotificationsAsRead(req) {
    return this.http.put('/api/v2/notifications/mark-read', req.getHttpBody());
  }

  /** @type {() => NotificationHttp} */
  static getInstance = createInstanceGetter(NotificationHttp);
}
