import { HttpService } from '@deip/http-service';
import { Singleton } from '@deip/toolbox';

class UserHttp extends Singleton {
  http = HttpService.getInstance();

  // Notifications

  getNotificationsByUser(username) {
    return this.http.get(`/api/notifications/user/${username}`);
  }

  markUserNotificationAsRead(username, notificationId) {
    return this.http.put(`/api/notifications/${username}/mark-read/${notificationId}`, {});
  }

  markAllUserNotificationAsRead(username) {
    return this.http.put(`/api/notifications/${username}/mark-all-read`, {});
  }

  // Bookmarks

  getResearchBookmarks(username) {
    return this.http.get(`/api/bookmarks/user/${username}?type=research`);
  }

  createResearchBookmark(username, researchId) {
    return this.http.post(`/api/bookmarks/user/${username}`, { type: 'research', researchId });
  }

  removeResearchBookmark(username, bookmarkId) {
    return this.http.delete_(`/api/bookmarks/user/${username}/remove/${bookmarkId}`);
  }

  // Invites

  sendApproveInvite(tx) {
    return this.http.post('/api/invites/approve', tx);
  }

  sendRejectInvite(tx) {
    return this.http.post('/api/invites/reject', tx);
  }
}

export {
  UserHttp
};
