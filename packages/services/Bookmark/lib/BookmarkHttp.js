import { HttpService } from '@deip/http-service';
import { createInstanceGetter } from '@deip/toolbox';

export class BookmarkHttp {
  http = HttpService.getInstance();

  // Bookmarks

  async getProjectBookmarks(username) {
    return this.http.get(`/api/v2/bookmarks/user/${username}?type=research`);
  }

  async createProjectBookmark(username, projectId) {
    return this.http.post(`/api/bookmarks/user/${username}`, { type: 'research', projectId });
  }

  async removeProjectBookmark(username, bookmarkId) {
    return this.http.delete(`/api/bookmarks/user/${username}/remove/${bookmarkId}`);
  }

  /** @type {() => BookmarkHttp} */
  static getInstance = createInstanceGetter(BookmarkHttp)
}
