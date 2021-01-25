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

  /* [DEPRECATED] use researchGroupService.getResearchGroupsByUser(username) */
  getUserTeams(username) {
    return deipRpc.api.getResearchGroupTokensByAccountAsync(username)
      .then((data) => data.map((g) => g.research_group.external_id));
  }

  getUser(username) {
    return Promise.all([
      this.usersHttp.getUser(username),
      this.getUserTeams(username) // TODO: get teams at the server side
    ])
      .then(([{ account, profile }, teams]) => ({
        username: account.name,
        account,
        profile,
        teams
      }));
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

  /* [DEPRECATED] */
  getUsersTeams(users) {
    return Promise.all(
      users.map((u) => this.getUserTeams(u))
    ).then((data) => data.map((teams, i) => ({
      username: users[i],
      teams
    })));
  }

  /* [DEPRECATED] use getUsersListing(status) */
  getActiveUsers() {
    return this.usersHttp.getActiveUsersProfiles()
      .then((profiles) => {
        const users = profiles.map((p) => p._id);

        return Promise.all([
          deipRpc.api.getAccountsAsync(users),
          this.getUsersTeams(users)
        ]).then(([accounts, teams]) => mapUsersData(accounts, profiles, teams));
      });
  }

  /* [DEPRECATED] use getUsersByResearchGroup(researchGroupExternalId) */
  getUsersByTeam(teamId) {
    return deipRpc.api.getResearchGroupMembershipTokensAsync(teamId)
      .then((tokens) => this.getEnrichedProfiles(tokens.map((t) => t.owner)));
  }

  /* [DEPRECATED] use getUsers */
  getEnrichedProfiles(users) {
    return Promise.all([
      deipRpc.api.getAccountsAsync(users),
      this.usersHttp.getUsersProfiles(users),
      this.getUsersTeams(users)
    ]).then(([accounts, profiles, teams]) => mapUsersData(accounts, profiles, teams));
  }

  getUsersListing(status) {
    return this.usersHttp.getUsersListing(status || "");
  }
}

export {
  UsersService
};
