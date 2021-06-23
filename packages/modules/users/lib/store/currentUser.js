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

    const username = rootGetters['auth/username'];

    return userService.getUser(username)
      .then((res) => {
        if (res) {
          commit('setData', res);
          dispatch('auth/setRoles', res.roles, { root: true });
        } else {
          console.error('No currentUser data');
          dispatch('auth/signOut', null, { root: true });
        }
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
