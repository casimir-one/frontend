import deipRpc from '@deip/rpc-client';
import { Singleton } from '@deip/toolbox';
import { UsersHttp } from './UsersHttp';

class UsersService extends Singleton {
  usersHttp = UsersHttp.getInstance();

  getUserProfile(username) {
    return this.usersHttp.getUserProfile(username);
  }

  getUsersProfiles(usernames) {
    return this.usersHttp.getUsersProfiles(usernames);
  }

  createUserProfile(username, data) {
    return this.usersHttp.createUserProfile(username, data);
  }

  updateUserProfile(username, update) {
    return this.usersHttp.updateUserProfile(username, update);
  }

  searchUsersByName(name) {
    return this.usersHttp.searchUsersByName(name);
  }

  getEnrichedProfiles(usernames) {
    const profilesPromise = this.usersHttp.getUsersProfiles(usernames)
      .then((profiles) => profiles, (err) => {
        console.log(err);
        return [];
      });

    const accountsPromise = deipRpc.api.getAccountsAsync(usernames)
      .then((accounts) => accounts, (err) => {
        console.log(err);
        return [];
      });

    return Promise.all([profilesPromise, accountsPromise])
      .then((response) => {
        const profiles = response[0];
        const accounts = response[1];
        const results = [];
        for (let i = 0; i < accounts.length; i++) {
          const account = accounts[i];
          const profile = profiles.find((p) => p._id === account.name);
          results.push({ profile, account });
        }
        return results;
      });
  }
}

export {
  UsersService
};
