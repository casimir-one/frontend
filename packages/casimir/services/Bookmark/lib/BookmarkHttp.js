import { HttpService } from '@deip/http-service';
import { USER_BOOKMARK_TYPE } from '@deip/constants';
import { makeSingletonInstance } from '@deip/toolbox';

export class BookmarkHttp {
  http = HttpService.getInstance();

  /**
   * Get bookmarks by username
   * @param {string} username
   * @returns {Promise<Object>}
   */
  async getListByUsername(username) {
    return this.http.get(`/api/v2/bookmarks/user/${username}?type=${USER_BOOKMARK_TYPE.PROJECT}`);
  }

  /**
   * Create bookmark
   * @param {Object} req
   * @returns {Promise<Object>}
   */
  async create(req) {
    return this.http.post('/api/v2/bookmarks', req.getHttpBody());
  }

  /**
   * Delete bookmark
   * @param {Object} req
   * @returns {Promise<Object>}
   */
  async delete(req) {
    return this.http.post('/api/v2/bookmarks/delete', req.getHttpBody());
  }

  /** @type {() => BookmarkHttp} */
  static getInstance = makeSingletonInstance(() => new BookmarkHttp());
}
