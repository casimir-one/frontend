import { UsersService } from '@deip/users-service';

import {
  listGetter,
  oneGetterFactory,
  setListMutationFactory,
  setOneMutationFactory
} from '@deip/platform-fns';
import { createFormData, hasValue } from '@deip/toolbox';

const usersService = UsersService.getInstance();

const STATE = {
  data: []
};

const GETTERS = {
  list: listGetter,
  one: oneGetterFactory({ selectorKey: 'username' })
};

const ACTIONS = {
  getList({ dispatch }, payload = {}) {
    const methods = {
      users: 'getListByNames',
      teamId: 'getListByTeam',
      tenantId: 'getListByTenant',
      status: 'getListByStatus'
    };

    for (const key of Object.keys(methods)) {
      if (hasValue(payload[key])) {
        return dispatch(methods[key], payload);
      }
    }

    return dispatch(methods.status, payload);
  },

  getListByNames({ commit }, { users }) {
    return usersService.getUsers(users)
      .then((data) => {
        commit('setList', data);
      })
      .catch((err) => {
        console.error(err);
      });
  },

  getListByTeam({ commit }, { teamId }) {
    return usersService.getUsersByResearchGroup(teamId)
      .then((data) => {
        commit('setList', data);
      })
      .catch((err) => {
        console.error(err);
      });
  },

  getListByTenant({ commit }, { tenantId }) {
    return usersService.getUsersByTenant(tenantId)
      .then((data) => {
        commit('setList', data);
      })
      .catch((err) => {
        console.error(err);
      });
  },

  getListByStatus({ commit }, { status = 'approved' }) {
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
    const { _id: username } = payload;
    const data = createFormData({ profile: payload });

    return usersService.updateUserProfile(username, data)
      .then(() => {
        dispatch('getOne', username);
      })
      .catch((err) => {
        console.error(err);
      });
  }
};

const MUTATIONS = {
  setList: setListMutationFactory({ mergeKey: 'username' }),
  setOne: setOneMutationFactory({ mergeKey: 'username' })
};

export const usersStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
