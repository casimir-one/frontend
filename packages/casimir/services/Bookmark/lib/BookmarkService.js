import { createInstanceGetter } from '@deip/toolbox';
import { JsonDataMsg } from '@deip/messages';
import {
  CreateBookmarkCmd,
  DeleteBookmarkCmd
} from '@deip/commands';
import { USER_BOOKMARK_TYPE } from '@deip/constants';
import { proxydi } from '@deip/proxydi';
import { BookmarkHttp } from './BookmarkHttp';

export class BookmarkService {
  bookmarkHttp = BookmarkHttp.getInstance();
  proxydi = proxydi;

  /**
   * Get bookmarks by username
   * @param {string} username
   * @returns {Promise<Object>}
   */
  async getListByUsername(username) {
    return this.bookmarkHttp.getListByUsername(username);
  }

  /**
   * Create bookmark
   * @param {Object} payload
   * @param {string} payload.username
   * @param {string} payload.projectId
   * @param {number} payload.type
   * @returns {Promise<Object>}
   */
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
    const env = this.proxydi.get('env');

    if (env.RETURN_MSG === true) {
      return msg;
    }

    return this.bookmarkHttp.create(msg);
  }

  /**
   * Delete bookmark
   * @param {string} username
   * @param {string} bookmarkId
   * @returns {Promise<Object>}
   */
  async delete(username, bookmarkId) {
    const deleteBookmarkCmd = new DeleteBookmarkCmd({
      username,
      bookmarkId
    });
    const msg = new JsonDataMsg({ appCmds: [deleteBookmarkCmd] });
    const env = this.proxydi.get('env');

    if (env.RETURN_MSG === true) {
      return msg;
    }

    return this.bookmarkHttp.delete(msg);
  }

  /** @type {() => BookmarkService} */
  static getInstance = createInstanceGetter(BookmarkService);
}
