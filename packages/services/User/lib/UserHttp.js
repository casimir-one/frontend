import { HttpService } from '@deip/http-service';
import { Singleton } from '@deip/toolbox';

class UserHttp extends Singleton {
  http = HttpService.getInstance();

  // Settings [deprecated]

  updateUserAccount(username, { tx }) {
    return this.http.put(`/api/user/account/${username}`, { tx });
  }

  updateUserProfile(username, update) {
    return this.http.put(`/api/user/profile/${username}`, update);
  }

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

  getInvitesByUser(username) {
    return this.http.get(`/api/invites/${username}`);
  }

  getUserTransactions(status) {
    return this.http.get(`/api/user/transactions/${status}`);
  }
}

export {
  UserHttp
};
