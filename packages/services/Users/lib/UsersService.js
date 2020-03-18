import deipRpc from '@deip/rpc-client';
import { Singleton } from '@deip/toolbox';
import { UsersHttp } from './UsersHttp';
import { ACTIONS_MAP } from './constants';

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

  mapHistoryElement(elem) {
    const source = elem.op[1];
    const mappedElem = {
      accountName: source.account_name,
      disciplineId: source.discipline_id,
      newAmount: source.new_eci_amount,
      delta: source.delta,
      action: ACTIONS_MAP[source.action],
      actionText: ACTIONS_MAP[source.action] === 'init'
        ? 'other'
        : ACTIONS_MAP[source.action] === 'content'
          ? 'research'
          : ACTIONS_MAP[source.action],
      actionObjectId: source.action_object_id,
      timestamp: source.timestamp * 1000
    };
    if (!mappedElem.action) {
      throw new Error('Unsupported action found');
    }
    return mappedElem;
  }

  getExpertiseHistory(username, disciplineId, from = 0, to = Date.now()) {
    const _from = Math.round(from / 1000);
    const _to = Math.ceil(to / 1000);

    return deipRpc.api.getEciHistoryByAccountAndDisciplineAsync(username, disciplineId)
      .then((history) => history.map(this.mapHistoryElement, this));
  }

  getEciPercentile(eciValue, username, disciplineId) {
    return 10;
  }
}

export {
  UsersService
};
