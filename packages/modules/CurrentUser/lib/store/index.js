import { AccessService } from '@deip/access-service';
import { UsersService } from '@deip/users-service';

const accessService = AccessService.getInstance();
const usersService = UsersService.getInstance();

const STATE = {
  username: null,
  account: {},
  profile: {}
};
const GETTERS = {
  data: (state) => {
    if (state.username) {
      return {
        username: state.username,
        account: state.account,
        profile: state.profile
      };
    }

    return null;
  }
};

const ACTIONS = {
  getData({ commit }) {
    if (accessService.isLoggedIn()) {
      const { username } = accessService.getDecodedToken();

      return usersService.getUserRe(username)
        .then(({ account, profile }) => {
          commit('setData', { username, account, profile });
        });
    }

    return Promise.resolve(false);
  },

  clear({ commit }) {
    commit('clearData');
  }
};

const MUTATIONS = {
  setData(state, { username, account, profile }) {
    state.username = username;
    state.account = account;
    state.profile = profile;
  },

  clearData(state) {
    state.username = null;
    state.account = {};
    state.profile = {};
  }
};

export const currentUserStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
