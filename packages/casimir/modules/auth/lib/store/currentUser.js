import { UserService } from '@deip/user-service';

const userService = UserService.getInstance();

const STATE = {
  data: null
};

const GETTERS = {
  data: (state) => state.data
};

const ACTIONS = {
  async get({ commit, dispatch, rootGetters }) {
    if (!rootGetters['auth/isLoggedIn']) {
      return Promise.resolve(false);
    }

    try {
      const res = await userService.getUser(rootGetters['auth/username']);
      commit('setData', res.data);
    } catch (err) {
      console.error('No currentUser data', err);
      dispatch('auth/signOut', null, { root: true });
    }

    return Promise.resolve(true);
  },

  clear({ commit }) {
    commit('setData', null);
  }

};

const MUTATIONS = {
  setData(state, payload) {
    state.data = payload;
  }

};

export const currentUserStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
