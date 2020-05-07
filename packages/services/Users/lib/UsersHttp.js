import { HttpService } from '@deip/http-service';
import { Singleton } from '@deip/toolbox';

class UsersHttp extends Singleton {
  http = HttpService.getInstance();

  getUserProfile(username) {
    return this.http.get(`/api/user/profile/${username}`);
  }

  getUsersProfiles(usernames) {
    return this.http.get(`/api/user/profiles${this.http.buildQueryString(usernames, 'accounts')}`);
  }

  getActiveUsersProfiles() {
    return this.http.get(`/api/user/active`);
  }
}

export {
  UsersHttp
};
