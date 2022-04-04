import { AuthService } from '@deip/auth-service';
import { UserService } from '@deip/user-service';
import { AccessService } from '@deip/access-service';
import { WebSocketService } from '@deip/web-socket-service';

import { wrapInArray, genRipemd160Hash } from '@deip/toolbox';

const accessService = AccessService.getInstance();
const authService = AuthService.getInstance();
const userService = UserService.getInstance();
const webSocketService = WebSocketService.getInstance();

const STATE = {
  username: null,
  isLoggedIn: false,
  settings: {
    signInRouteName: 'signIn',
    signUpRouteName: 'signUp',
    signInRedirectRouteName: 'home'
  }
};

const GETTERS = {
  username: (state) => state.username,
  settings: (state) => state.settings,
  isLoggedIn: (state) => state.isLoggedIn
};

const ACTIONS = {

  restoreData({ commit }) {
    if (accessService.isLoggedIn()) {
      commit('setData');
    }
  },

  async signIn({ commit, dispatch }, { username: usernameOrEmail, password: passwordOrPrivKey }) {
    const exists = await userService.checkIfUserExists(usernameOrEmail);

    if (!exists) {
      throw new Error('Wrong email or password. Please try again.');
    }

    const { data: seedUser } = await userService.getOne(usernameOrEmail);
    const seedAccount = await authService.generateSeedAccount(seedUser.username, passwordOrPrivKey);

    const { data: signIn } = await authService.signIn({
      username: seedAccount.getUsername(),
      secretSigHex: seedAccount.signString(this._vm.$env.SIG_SEED)
    });

    if (!signIn.success) {
      dispatch('clear');
      throw new Error(signIn.error);
    }

    commit('setData', {
      jwtToken: signIn.jwtToken,
      privateKey: seedAccount.getPrivKey(),
      publicKey: seedAccount.getPubKey()
    });
    webSocketService.connect();
  },

  async signUp(_, payload) {
    const { email, password: passwordOrPrivKey } = payload;

    const exists = await userService.checkIfUserExists(email);

    if (exists) {
      throw new Error('User with such email exists');
    }

    const username = genRipemd160Hash(email);
    const seedAccount = await authService.generateSeedAccount(username, passwordOrPrivKey);

    const { data: signUp } = await authService.signUp({
      privKey: seedAccount.getPrivKey(),
      isAuthorizedCreatorRequired: seedAccount.isAuthorizedCreatorRequired()
    }, {
      email: payload.email,
      username: seedAccount.getUsername(),
      pubKey: seedAccount.getPubKey(),
      attributes: payload.attributes,
      ...{ roles: wrapInArray(payload.roles) }
    });

    return signUp;
  },

  signOut({ dispatch }) {
    dispatch('clear');
    window.location.reload();
  },

  clear({ commit }) {
    commit('clearData');
  },

  setup({ commit }, {
    signInRouteName,
    signInRedirectRouteName,
    signUpRouteName
  }) {
    commit('setSettings', {
      ...(signInRouteName ? { signInRouteName } : {}),
      ...(signInRedirectRouteName ? { signInRedirectRouteName } : {}),
      ...(signUpRouteName ? { signUpRouteName } : {})
    });
  },

  changePassword({ dispatch }, payload) {
    const { initiator, data: formPass } = payload;
    const { oldPassword, newPassword } = formPass;

    return authService.generateSeedAccount(initiator.username, oldPassword)
      .then((oldSeedAccount) => {
        const oldPublicKey = oldSeedAccount.getPubKey();

        if (initiator.pubKey !== oldPublicKey) throw new Error('Old password is invalid');

        return authService.generateSeedAccount(initiator.username, newPassword);
      })
      .then((newSeedAccount) => {
        const newPublicKey = newSeedAccount.getPubKey();
        const newPrivateKey = newSeedAccount.getPrivKey();

        const authority = {
          owner: {
            auths: [{ key: newPublicKey, weight: 1 }],
            weight: 1
          }
        };

        const data = {
          ...initiator,
          authority
        };

        return userService.changePassword({ initiator, ...data })
          .then(() => dispatch('currentUser/get', null, { root: true })
            .then(() => accessService.setOwnerKeysPair(newPrivateKey, newPublicKey))
            .then(() => Promise.resolve({ privKey: newPrivateKey, pubKey: newPublicKey })));
      })
      .catch((err) => Promise.reject(err));
  }

};

const MUTATIONS = {
  setData(state, { jwtToken, privateKey, publicKey } = {}) {
    if (jwtToken && privateKey && publicKey) {
      accessService.setAccessToken(jwtToken, privateKey, publicKey);
    }

    state.username = accessService.getDecodedToken().username;
    state.isLoggedIn = accessService.isLoggedIn();
  },

  clearData(state) {
    accessService.clearAccessToken();

    state.username = null;
    state.isLoggedIn = accessService.isLoggedIn();
  },

  setSettings(state, payload) {
    state.settings = {
      ...state.settings,
      ...payload
    };
  }

};

export const authStore = {
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS,
  namespaced: true
};
