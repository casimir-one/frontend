import { UserService } from '@deip/user-service';

const userService = UserService.getInstance();

const STATE = {
  data: null
};

const GETTERS = {
  data: (state) => state.data
};

const ACTIONS = {
  get({ commit, dispatch, rootGetters }) {
    if (!rootGetters['auth/isLoggedIn']) {
      return Promise.resolve(false);
    }

    const userId = rootGetters['auth/username'];

    return userService.getUser(userId)
      .then((res) => {
        if (res) {
          commit('setData', res);
        }
      })
      .catch(() => {
        console.error('No currentUser data');
        dispatch('auth/signOut', null, { root: true });
      });
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
