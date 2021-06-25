import { HttpService } from '@deip/http-service';
import { Singleton } from '@deip/toolbox';
import qs from 'qs';

class UserHttp extends Singleton {
  http = HttpService.getInstance();

  // Settings [deprecated]

  updateUser(req) {
    return this.http.put('/api/v2/user/update', req.getRequestBody(), { headers: req.getRequestHeaders() });
  }

  // Invites

  getInvitesByUser(username) {
    return this.http.get(`/api/invites/${username}`);
  }

  getUsers(usernames) {
    const query = qs.stringify({ usernames });
    return this.http.get(`/api/v2/users?${query}`);
  }

  getUsersByTeam(teamId) {
    return this.http.get(`/api/v2/users/team/${teamId}`);
  }

  getUsersByTenant(tenantId) {
    return this.http.get(`/api/v2/users/tenant/${tenantId}`);
  }

  getUsersListing(query) {
    const q = qs.stringify(query);
    return this.http.get(`/api/v2/users/listing?${q}`);
  }

  // ONE

  getUser(username) {
    return this.http.get(`/api/v2/user/name/${username}`);
  }

  getUserByEmail(email) {
    return this.http.get(`/api/v2/user/email/${email}`);
  }
}

export {
  UserHttp
};
