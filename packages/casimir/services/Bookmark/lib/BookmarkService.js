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

  async getListByUsername(username) {
    return this.bookmarkHttp.getListByUsername(username);
  }

  async create(payload) {
    const {
      username,
      projectId,
      type = USER_BOOKMARK_TYPE.PROJECT
    } = payload;

    const createBookmarkCmd = new CreateBookmarkCmd({
      username,
      ref: projectId,
      type
    });
    const msg = new JsonDataMsg({ appCmds: [createBookmarkCmd] });
    return this.bookmarkHttp.create(msg);
  }

  async delete(username, bookmarkId) {
    const deleteBookmarkCmd = new DeleteBookmarkCmd({
      username,
      bookmarkId
    });
    const msg = new JsonDataMsg({ appCmds: [deleteBookmarkCmd] });
    return this.bookmarkHttp.delete(msg);
  }

  /** @type {() => BookmarkService} */
  static getInstance = createInstanceGetter(BookmarkService);
}
