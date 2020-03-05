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

  createUserProfile(username, data) {
    return this.http.post(`/api/user/profile/${username}`, data);
  }

  updateUserProfile(username, update) {
    return this.http.put(`/api/user/profile/${username}`, update);
  }

  searchUsersByName(name) {
    return this.http.get(`/users/search/${name}`);
  }
}

export {
  UsersHttp
};
