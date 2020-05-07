import deipRpc from '@deip/rpc-client';
import { Singleton } from '@deip/toolbox';
import { UsersHttp } from './UsersHttp';
import { BlockchainService } from '@deip/blockchain-service';

class UsersService extends Singleton {
  usersHttp = UsersHttp.getInstance();
  blockchainService = BlockchainService.getInstance();

  getUserProfile(username) {
    return this.usersHttp.getUserProfile(username);
  }

  getActiveUsers() {
    const profiles = [];
    return this.usersHttp.getActiveUsersProfiles()
      .then((items) => {
        profiles.push(...items);
        return deipRpc.api.getAccountsAsync(profiles.map(p => p._id));
      })
      .then((accounts) => {
        return profiles.reduce((acc, profile, i) => {
          return [...acc, { account: accounts[i], profile }];
        }, []);
      });
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
