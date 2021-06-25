import { Singleton } from '@deip/toolbox';
import { BookmarkHttp } from './BookmarkHttp';

class BookmarkService extends Singleton {
  bookmarkHttp = BookmarkHttp.getInstance();

  getProjectBookmarks(username) {
    return this.bookmarkHttp.getProjectBookmarks(username);
  }

  createProjectBookmark(username, researchId) {
    return this.bookmarkHttp.createProjectBookmark(username, researchId);
  }

  removeProjectBookmark(username, bookmarkId) {
    return this.bookmarkHttp.removeProjectBookmark(username, bookmarkId);
  }
}

export {
  BookmarkService
};
