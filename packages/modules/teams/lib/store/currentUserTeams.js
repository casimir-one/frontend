import {
  clearMutation,
  listGetter,
  oneGetter,
  setListMutation
} from '@deip/platform-fns/lib/store';

import { teamsStore } from './teams';

const STATE = {
  data: []
};

const GETTERS = {
  list: listGetter,
  one: oneGetter
};

const ACTIONS = {
  getList({ commit, rootGetters }) {
    if (!rootGetters['auth/isLoggedIn']) {
      return Promise.resolve(false);
    }

    return teamsStore.actions.getTeamsByUser({ commit }, rootGetters['auth/username']);
  },

  clear({ commit }) {
    commit('clear');
  }
};

const MUTATIONS = {
  setList: setListMutation,
  clear: clearMutation
};

export const currentUserTeamsStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
