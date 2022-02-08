import { createInstanceGetter } from '@deip/toolbox';
import { JsonDataMsg } from '@deip/messages';
import {
  CreateBookmarkCmd,
  DeleteBookmarkCmd
} from '@deip/commands';
import { USER_BOOKMARK_TYPE } from '@deip/constants';
import { BookmarkHttp } from './BookmarkHttp';

export class BookmarkService {
  bookmarkHttp = BookmarkHttp.getInstance();

  async getProjectBookmarks(username) {
    return this.bookmarkHttp.getProjectBookmarks(username);
  }

  async createProjectBookmark(username, projectId, type = USER_BOOKMARK_TYPE.PROJECT) {
    const createBookmarkCmd = new CreateBookmarkCmd({
      username,
      ref: projectId,
      type
    });
    const msg = new JsonDataMsg({ appCmds: [createBookmarkCmd] });
    return this.bookmarkHttp.createProjectBookmark(msg);
  }

  async deleteProjectBookmark(username, bookmarkId) {
    const deleteBookmarkCmd = new DeleteBookmarkCmd({
      username,
      bookmarkId
    });
    const msg = new JsonDataMsg({ appCmds: [deleteBookmarkCmd] });
    return this.bookmarkHttp.deleteProjectBookmark(msg);
  }

  /** @type {() => BookmarkService} */
  static getInstance = createInstanceGetter(BookmarkService);
}
