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
  get({ commit, dispatch }) {
    if (accessService.isLoggedIn()) {
      const { username } = accessService.getDecodedToken();

      return usersService.getUser(username)
        .then((res) => {
          if (res) {
            const { account, profile } = res;
            commit('setData', { username, account, profile });
          } else {
            console.error('No currentUser data')
            dispatch('auth/signOut', null, { root: true });
          }
        });
    }

    return Promise.resolve(false);
  },

  clear({ commit }) {
    commit('setData', {
      username: null,
      account: {},
      profile: {}
    });
  }
};

const MUTATIONS = {
  setData(state, { username, account, profile }) {
    state.username = username;
    state.account = account;
    state.profile = profile;
  }
};

export const currentUserStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
