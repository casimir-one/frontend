import { HttpService, serializeParams } from '@deip/http-service';
import { createInstanceGetter } from '@deip/toolbox';

export class UserHttp {
  http = HttpService.getInstance();

  // Settings [deprecated]

  async updateUser(req) {
    return this.http.put('/api/v2/user/update', req.getHttpBody(), { headers: req.getHttpHeaders() });
  }

  // Invites

  async getInvitesByUser(username) {
    return this.http.get(`/api/invites/${username}`);
  }

  async getUsers(usernames) {
    const query = serializeParams({ usernames });
    return this.http.get(`/api/v2/users?${query}`);
  }

  async getUsersByTeam(teamId) {
    return this.http.get(`/api/v2/users/team/${teamId}`);
  }

  async getUsersByTenant(tenantId) {
    return this.http.get(`/api/v2/users/tenant/${tenantId}`);
  }

  async getUsersListing(params) {
    const query = serializeParams(params);
    return this.http.get(`/api/v2/users/listing?${query}`);
  }

  // ONE

  async getUser(username) {
    return this.http.get(`/api/v2/user/name/${username}`);
  }

  async getUserByEmail(email) {
    return this.http.get(`/api/v2/user/email/${email}`);
  }

  /** @type {() => UserHttp} */
  static getInstance = createInstanceGetter(UserHttp);
}
