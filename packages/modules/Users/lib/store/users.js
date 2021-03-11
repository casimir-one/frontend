import { UsersService } from '@deip/users-service';

import {
  camelizeObjectKeys,
  collectionList,
  collectionMerge,
  collectionOne
} from '@deip/toolbox';

const usersService = UsersService.getInstance();

const STATE = {
  data: []
};

const GETTERS = {
  list: (state) => (query = {}) => collectionList(state.data, query),

  one: (state) => (username, query = {}) => collectionOne(state.data, {
    ...(username ? { username } : {}),
    ...query
  })
};

const ACTIONS = {
  fetch({ commit }) {
    return usersService.getUsersListing()
      .then((data) => {
        commit('setList', data);
      })
      .catch((err) => {
        console.error(err);
      });
  },

  get({ commit }, username) {
    return usersService.getUser(username)
      .then(({ account, profile }) => {
        commit('setOne', { username, account, profile });
      })
      .catch((err) => {
        console.error(err);
      });
  }
};

const MUTATIONS = {
  setList(state, payload) {
    if (!payload) return;

    state.data = collectionMerge(
      state.data,
      payload.map((asset) => camelizeObjectKeys(asset)),
      { key: 'username' }
    );
  },

  setOne(state, payload) {
    if (!payload) return;

    state.data = collectionMerge(
      state.data,
      camelizeObjectKeys(payload),
      { id: 'username' }
    );
  }
};

export const usersStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
