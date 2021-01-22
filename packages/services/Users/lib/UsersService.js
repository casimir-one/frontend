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

  rpcApi = deipRpc.api;

  // ////////////////////////////////////////

  getUserProfile(username) {
    return this.usersHttp.getUserProfile(username);
  }

  getUserAccount(username) {
    return this.rpcApi.getAccountsAsync([username])
      .then((data) => data[0]);
  }

  getUserTeams(username) {
    return this.rpcApi.getResearchGroupTokensByAccountAsync(username)
      .then((data) => data.map((g) => g.research_group.external_id));
  }

  getUser(username) {
    return Promise.all([
      this.getUserAccount(username),
      this.getUserProfile(username),
      this.getUserTeams(username)
    ])
      .then(([account, profile, teams]) => ({
        username: account.name,
        account,
        profile,
        teams
      }));
  }

  // TODO: rename and switch
  getUserRe(username) {
    if (username.includes('@')) {
      return this.usersHttp.getUserByEmail(username);
    }

    return this.usersHttp.getUser(username);
  }

  // ////////////////////////////////////////

  getUsersTeams(users) {
    return Promise.all(
      users.map((u) => this.getUserTeams(u))
    ).then((data) => data.map((teams, i) => ({
      username: users[i],
      teams
    })));
  }

  getActiveUsers() {
    return this.usersHttp.getActiveUsersProfiles()
      .then((profiles) => {
        const users = profiles.map((p) => p._id);

        return Promise.all([
          this.rpcApi.getAccountsAsync(users),
          this.getUsersTeams(users)
        ]).then(([accounts, teams]) => mapUsersData(accounts, profiles, teams));
      });
  }

  getUsersByTeam(teamId) {
    return this.rpcApi.getResearchGroupMembershipTokensAsync(teamId)
      .then((tokens) => this.getEnrichedProfiles(tokens.map((t) => t.owner)));
  }

  // ////////////////////////////////////////

  getEnrichedProfiles(users) { // rename to getUsers
    return Promise.all([
      this.rpcApi.getAccountsAsync(users),
      this.usersHttp.getUsersProfiles(users),
      this.getUsersTeams(users)
    ]).then(([accounts, profiles, teams]) => mapUsersData(accounts, profiles, teams));
  }
}

export {
  UsersService
};
