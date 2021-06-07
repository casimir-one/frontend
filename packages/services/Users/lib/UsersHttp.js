import { HttpService } from '@deip/http-service';
import { Singleton } from '@deip/toolbox';
import qs from 'qs';

class UsersHttp extends Singleton {
  http = HttpService.getInstance();

  getUsersProfiles(usernames) { // DEPRECATED
    return this.http.get(`/api/v2/users/profile${this.http.buildQueryString(usernames, 'accounts')}`);
  }

  getActiveUsersProfiles() { // DEPRECATED
    return this.http.get('/api/v2/users/active');
  }

  // LIST

  getUsers(usernames) {
    const query = qs.stringify({ usernames });
    return this.http.get(`/api/v2/users?${query}`);
  }

  getUsersByResearchGroup(teamId) {
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
  UsersHttp
};
