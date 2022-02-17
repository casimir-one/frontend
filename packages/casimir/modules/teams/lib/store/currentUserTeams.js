import {
  clearMutation,
  listGetter,
  oneGetter,
  setListMutation
} from '@deip/platform-util';

const STATE = {
  data: []
};

const GETTERS = {
  list: listGetter,
  one: oneGetter
};

const ACTIONS = {
  getList({ rootGetters, dispatch }) {
    if (!rootGetters['auth/isLoggedIn']) {
      return Promise.resolve(false);
    }

    return dispatch('teams/getTeamsByUser', rootGetters['auth/username'], { root: true });
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
