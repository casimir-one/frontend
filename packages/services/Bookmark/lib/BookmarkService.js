import { createInstanceGetter } from '@deip/toolbox';
import { BookmarkHttp } from './BookmarkHttp';

export class BookmarkService {
  bookmarkHttp = BookmarkHttp.getInstance();

  async getProjectBookmarks(username) {
    return this.bookmarkHttp.getProjectBookmarks(username);
  }

  async createProjectBookmark(username, researchId) {
    return this.bookmarkHttp.createProjectBookmark(username, researchId);
  }

  async removeProjectBookmark(username, bookmarkId) {
    return this.bookmarkHttp.removeProjectBookmark(username, bookmarkId);
  }

  /** @type {() => BookmarkService} */
  static getInstance = createInstanceGetter(BookmarkService);
}
