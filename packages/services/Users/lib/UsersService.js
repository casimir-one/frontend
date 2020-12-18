import deipRpc from '@deip/rpc-client';
import { Singleton } from '@deip/toolbox';
import { UsersHttp } from './UsersHttp';

class UsersService extends Singleton {
  usersHttp = UsersHttp.getInstance();

  // ////////////////////////////////////////

  getUserProfile(username) {
    return this.usersHttp.getUserProfile(username);
  }

  getUserAccount(username) {
    return deipRpc.api.getAccountsAsync([username])
      .then((data) => data[0]);
  }

  getUser(username) {
    return Promise.all([
      this.getUserAccount(username),
      this.getUserProfile(username)
    ])
      .then(([account, profile]) => ({ account, profile }));
  }

  // ////////////////////////////////////////

  getActiveUsers() {
    const result = [];
    const profiles = [];
    return this.usersHttp.getActiveUsersProfiles()
      .then((items) => {
        profiles.push(...items);
        return deipRpc.api.getAccountsAsync(profiles.map((p) => p._id));
      })
      .then((accounts) => {
        for (let i = 0; i < profiles.length; i++) {
          const profile = profiles[i];
          const account = accounts.find((a) => a.name == profile._id);
          result.push({ profile, account });
        }
        return result;
      });
  }

  getUsersByTeam(teamId) {
    // res.map((user) => ({
    //   ...user,
    //   groupTokens: tokens.find((t) => t.owner === user.account.name)
    // }))

    return deipRpc.api.getResearchGroupMembershipTokensAsync(teamId)
      .then((tokens) => this.getEnrichedProfiles(tokens.map((t) => t.owner)));
  }

  // ////////////////////////////////////////

  getEnrichedProfiles(usernames) { // rename to getUsers
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
