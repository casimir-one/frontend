import { AccessService } from '@deip/access-service';
import { UsersService } from '@deip/users-service';

const accessService = AccessService.getInstance();
const usersService = UsersService.getInstance();

const defaultState = () => ({
  username: null,
  account: {},
  profile: {},
  privKey: null
});

const STATE = defaultState();

const GETTERS = {
  data: (state) => {
    if (state.username) {
      return {
        username: state.username,
        account: state.account,
        profile: state.profile,
        privKey: state.privKey
      };
    }

    return null;
  }
};

const ACTIONS = {
  get({ commit, dispatch, rootGetters }) {
    if (!rootGetters['auth/isLoggedIn']) {
      return Promise.resolve(false);
    }

    const username = rootGetters['auth/username'];

    return usersService.getUser(username)
      .then((res) => {
        if (res) {
          const { account, profile } = res;
          const privKey = accessService.getOwnerWif();

          commit('setData', {
            username, account, profile, privKey
          });
        } else {
          console.error('No currentUser data');
          dispatch('auth/signOut', null, { root: true });
        }
      });
  },

  clear({ commit }) {
    commit('setData', defaultState());
  }
};

const MUTATIONS = {
  setData(state, {
    username, account, profile, privKey
  }) {
    state.username = username;
    state.account = account;
    state.profile = profile;
    state.privKey = privKey;
  }
};

export const currentUserStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
