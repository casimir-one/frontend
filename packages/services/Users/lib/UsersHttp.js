import { HttpService } from '@deip/http-service';
import { Singleton } from '@deip/toolbox';
import qs from 'qs';

class UsersHttp extends Singleton {
  http = HttpService.getInstance();

  getUsersProfiles(usernames) {
    return this.http.get(`/api/user/profiles${this.http.buildQueryString(usernames, 'accounts')}`);
  }

  getActiveUsersProfiles() {
    return this.http.get(`/api/user/active`);
  }

  getUser(username) {
    return this.http.get(`/api/user/name/${username}`);
  }

  getUserByEmail(email) {
    return this.http.get(`/api/user/email/${email}`);
  }

  getUsers(usernames) {
    const query = qs.stringify({ usernames });
    return this.http.get(`/api/users?${query}`);
  }

  getUsersByResearchGroup(researchGroupExternalId) {
    return this.http.get(`/api/users/group/${researchGroupExternalId}`);
  }

  getUsersByTenant(tenantId) {
    return this.http.get(`/api/users/tenant/${tenantId}`);
  }

  getUsersListing(status) {
    const query = qs.stringify({ status });
    return this.http.get(`/api/users/listing?${query}`);
  }

}

export {
  UsersHttp
};
