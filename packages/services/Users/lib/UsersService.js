// import deipRpc from '@deip/rpc-client';
import { Singleton } from '@deip/toolbox';
import { UsersHttp } from './UsersHttp';

// const mapUsersData = (
//   accounts = [],
//   profiles = [],
//   teams = []
// ) => accounts.map((account) => ({
//   username: account.name,
//   account,
//   profile: profiles.find((profile) => profile._id === account.name),
//   teams: teams.find((item) => item.username === account.name).teams
// }));

class UsersService extends Singleton {
  usersHttp = UsersHttp.getInstance();

  // LIST

  getUsers(usernames) {
    return this.usersHttp.getUsers(usernames);
  }

  getUsersByResearchGroup(researchGroupExternalId) {
    return this.usersHttp.getUsersByResearchGroup(researchGroupExternalId);
  }

  getUsersByTenant(tenantId) {
    return this.usersHttp.getUsersByTenant(tenantId);
  }

  getUsersListing(query = {}) {
    return this.usersHttp.getUsersListing(query);
  }

  // ONE

  getUser(username) {
    if (username.includes('@')) {
      return this.usersHttp.getUserByEmail(username);
    }
    return this.usersHttp.getUser(username);
  }

  updateUserProfile(username, payload) {
    return this.usersHttp.updateUserProfile(username, payload);
  }

  updateUserAccount(username, payload) {
    return this.usersHttp.updateUserProfile(username, payload);
  }
}

export {
  UsersService
};
