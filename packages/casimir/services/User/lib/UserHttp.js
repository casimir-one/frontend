import { HttpService, serializeParams } from '@deip/http-service';
import { createInstanceGetter } from '@deip/toolbox';

export class UserHttp {
  http = HttpService.getInstance();

  // Settings [deprecated]

  async update(req) {
    return this.http.put('/api/v2/user/update', req.getHttpBody(), { headers: req.getHttpHeaders() });
  }

  changePassword(req) {
    return this.http.put('/api/v2/user/update/password', req.getHttpBody(), { headers: req.getHttpHeaders() });
  }

  async getInvitesByUser(username) {
    return this.http.get(`/api/v2/invites/${username}`);
  }

  async getListByIds(usernames) {
    const query = serializeParams({ usernames });
    return this.http.get(`/api/v2/users?${query}`);
  }

  async getListByTeam(teamId) {
    return this.http.get(`/api/v2/users/team/${teamId}`);
  }

  async getListByPortal(portalId) {
    return this.http.get(`/api/v2/users/portal/${portalId}`);
  }

  async getList(params) {
    const query = serializeParams(params);
    return this.http.get(`/api/v2/users/listing?${query}`);
  }

  async getOne(username) {
    return this.http.get(`/api/v2/user/name/${username}`);
  }

  async getOneByEmail(email) {
    return this.http.get(`/api/v2/user/email/${email}`);
  }

  /** @type {() => UserHttp} */
  static getInstance = createInstanceGetter(UserHttp);
}
