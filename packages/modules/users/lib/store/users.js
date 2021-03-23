import { UsersService } from '@deip/users-service';

import {
  listGetter,
  oneGetterFabric,
  setListMutationFabric,
  setOneMutationFabric
} from '@deip/platform-fns/lib/store';
import { hasValue } from '@deip/toolbox';

const usersService = UsersService.getInstance();


const STATE = {
  data: []
};

const GETTERS = {
  list: listGetter,
  one: oneGetterFabric({ selectorKey: 'username' })
};

const ACTIONS = {
  get({ dispatch }, payload = {}) {

    const methods = {
      users: 'getByNames',
      teamId: 'getByTeam',
      tenantId: 'getByTenant',
      status: 'getByStatus',
    }

    for (const key of Object.keys(methods)) {
      if (hasValue(payload[key])) {
        return dispatch(methods[key], payload);
      }
    }

    return dispatch(methods.status, payload);
  },

  getByNames({ commit }, { users }) {
    return usersService.getUsers(users)
      .then((data) => {
        commit('setList', data);
      })
      .catch((err) => {
        console.error(err);
      });
  },

  getByTeam({ commit }, { teamId }) {
    return usersService.getUsersByResearchGroup(teamId)
      .then((data) => {
        commit('setList', data);
      })
      .catch((err) => {
        console.error(err);
      });
  },

  getByTenant({ commit }, { tenantId }) {
    return usersService.getUsersByTenant(tenantId)
      .then((data) => {
        commit('setList', data);
      })
      .catch((err) => {
        console.error(err);
      });
  },

  getByStatus({ commit }, { status = 'approved' }) {
    return usersService.getUsersListing(status)
      .then((data) => {
        commit('setList', data);
      })
      .catch((err) => {
        console.error(err);
      });
  },

  // one

  getOne({ commit }, username) {
    return usersService.getUser(username)
      .then(({ account, profile }) => {
        commit('setOne', { username, account, profile });
      })
      .catch((err) => {
        console.error(err);
      });
  },

  update({ dispatch }, payload) {
    const { username } = payload;

    return usersService.updateUserProfile(username)
      .then(() => {
        dispatch('getOne', username);
      })
      .catch((err) => {
        console.error(err);
      });
  }
};

const MUTATIONS = {
  setList: setListMutationFabric({ mergeKey: 'username' }),
  setOne: setOneMutationFabric({ mergeKey: 'username' })
};

export const usersStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
