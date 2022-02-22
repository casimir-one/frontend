import { HttpService, serializeParams } from '@deip/http-service';
import { createInstanceGetter } from '@deip/toolbox';

export class UserHttp {
  http = HttpService.getInstance();

  // Settings [deprecated]

  /**
 * Update user information
 * @param {Object} req
 * @return {Promise<Object>}
 */
  async update(req) {
    return this.http.put('/api/v2/user/update', req.getHttpBody(), { headers: req.getHttpHeaders() });
  }

  /**
 * Change user password
 * @param {Object} req
 * @return {Promise<Object>}
 */
  changePassword(req) {
    return this.http.put('/api/v2/user/update/password', req.getHttpBody(), { headers: req.getHttpHeaders() });
  }

  /**
 * Get invites by username
 * @param {string} username
 * @return {Promise<Object>}
 */
  async getInvitesByUser(username) {
    return this.http.get(`/api/v2/invites/${username}`);
  }

  /**
 * Get users by several ids
 * @param {string[]} usernames
 * @return {Promise<Object>}
 */
  async getListByIds(usernames) {
    const query = serializeParams({ usernames });
    return this.http.get(`/api/v2/users?${query}`);
  }

  /**
 * Get users by team id
 * @param {string} teamId
 * @return {Promise<Object>}
 */
  async getListByTeam(teamId) {
    return this.http.get(`/api/v2/users/team/${teamId}`);
  }

  /**
 * Get users by portal id
 * @param {string} portalId
 * @return {Promise<Object>}
 */
  async getListByPortal(portalId) {
    return this.http.get(`/api/v2/users/portal/${portalId}`);
  }

  /**
 * Get users by several parameters
 * @param {Object} params
 * @return {Promise<Object>}
 */
  async getList(params) {
    const query = serializeParams(params);
    return this.http.get(`/api/v2/users/listing?${query}`);
  }

  /**
 * Get user by given username
 * @param {string} username
 * @return {Promise<Object>}
 */
  async getOne(username) {
    return this.http.get(`/api/v2/user/name/${username}`);
  }

  /**
 * Get user by given email
 * @param {string} email
 * @return {Promise<Object>}
 */
  async getOneByEmail(email) {
    return this.http.get(`/api/v2/user/email/${email}`);
  }

  /** @type {() => UserHttp} */
  static getInstance = createInstanceGetter(UserHttp);
}
