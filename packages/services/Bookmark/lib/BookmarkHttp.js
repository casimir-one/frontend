import { HttpService } from '@deip/http-service';
import { USER_BOOKMARK_TYPE } from '@deip/constants';
import { createInstanceGetter } from '@deip/toolbox';

export class BookmarkHttp {
  http = HttpService.getInstance();

  // Bookmarks

  async getProjectBookmarks(username) {
    return this.http.get(`/api/v2/bookmarks/user/${username}?type=${USER_BOOKMARK_TYPE.PROJECT}`);
  }

  async createProjectBookmark(req) {
    return this.http.post('/api/v2/bookmarks', req.getHttpBody());
  }

  async deleteProjectBookmark(req) {
    return this.http.post('/api/v2/bookmarks/delete', req.getHttpBody());
  }

  /** @type {() => BookmarkHttp} */
  static getInstance = createInstanceGetter(BookmarkHttp)
}
