import { HttpService } from '@deip/http-service';
import { Singleton } from '@deip/toolbox';

class BookmarkHttp extends Singleton {
  http = HttpService.getInstance();

  // Bookmarks

  getProjectBookmarks(username) {
    return this.http.get(`/api/v2/bookmarks/user/${username}?type=research`);
  }

  createProjectBookmark(username, projectId) {
    return this.http.post(`/api/bookmarks/user/${username}`, { type: 'research', projectId });
  }

  removeProjectBookmark(username, bookmarkId) {
    return this.http.delete_(`/api/bookmarks/user/${username}/remove/${bookmarkId}`);
  }
}

export {
  BookmarkHttp
};
