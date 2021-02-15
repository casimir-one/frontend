import deipRpc from '@deip/rpc-client';
import { Singleton } from '@deip/toolbox';
import { UsersHttp } from './UsersHttp';

const mapUsersData = (
  accounts = [],
  profiles = [],
  teams = []
) => accounts.map((account) => ({
  username: account.name,
  account,
  profile: profiles.find((profile) => profile._id === account.name),
  teams: teams.find((item) => item.username === account.name).teams
}));

class UsersService extends Singleton {
  usersHttp = UsersHttp.getInstance();

  getUser(username) {
    return this.usersHttp.getUser(username);
  }

  getUsers(usernames) {
    return this.usersHttp.getUsers(usernames);
  }

  // TODO: rename and switch
  getUserRe(username) {
    if (username.includes('@')) {
      return this.usersHttp.getUserByEmail(username);
    }
    return this.usersHttp.getUser(username);
  }

  getUsersByResearchGroup(researchGroupExternalId) {
    return this.usersHttp.getUsersByResearchGroup(researchGroupExternalId)
  }

  getUsersListing(status) {
    return this.usersHttp.getUsersListing(status || "");
  }

  getUsersByTenant(tenantId) {
    return this.usersHttp.getUsersByTenant(tenantId);
  }
}

export {
  UsersService
};
