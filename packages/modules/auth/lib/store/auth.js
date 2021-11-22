import { proxydi } from '@deip/proxydi';
import { AuthService } from '@deip/auth-service';
import { UserService } from '@deip/user-service';
import { AccessService } from '@deip/access-service';
import { wrapInArray, genRipemd160Hash } from '@deip/toolbox';

const accessService = AccessService.getInstance();
const authService = AuthService.getInstance();
const userService = UserService.getInstance();

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

  signIn({ commit, dispatch }, { username: usernameOrEmail, password: passwordOrPrivKey }) {
    const env = proxydi.get('env');
    let privateKey; let publicKey;

    return userService.checkIfUserExists(usernameOrEmail)
      .then((exists) => {
        if (!exists) {
          throw new Error('No such user exists');
        }
        return userService.getUser(usernameOrEmail);
      })
      // TODO: There is no way to define programmatically what user provides exactly -
      // Password or Private Key, we have to resolve it via UI control (e.g. switch/checkbox)
      .then(({ username }) => authService.generateSeedAccount(username, passwordOrPrivKey))
      .then((seedAccount) => {
        privateKey = seedAccount.getPrivKey();
        publicKey = seedAccount.getPubKey();
        return authService.signIn({
          username: seedAccount.getUsername(),
          secretSigHex: seedAccount.signString(env.SIG_SEED)
        });
      })
      .then((response) => {
        if (!response.success) {
          dispatch('clear');
          throw new Error(response.error);
        }

        commit('setData', {
          jwtToken: response.jwtToken,
          privateKey,
          publicKey
        });
      });
  },

  signUp(_, payload) {
    const { email, password: passwordOrPrivKey } = payload;

    return userService.checkIfUserExists(email)
      .then((exists) => {
        if (exists) {
          throw new Error('User with such email exists');
        }
      })
      .then(() => {
        const username = genRipemd160Hash(email);
        // TODO: There is no way to define programmatically what user provides exactly -
        // Password or Private Key, we have to resolve it via UI control (e.g. switch/checkbox)
        return authService.generateSeedAccount(username, passwordOrPrivKey);
      })
      .then((seedAccount) => authService.signUp({
        privKey: seedAccount.getPrivKey(),
        isAuthorizedCreatorRequired: seedAccount.isAuthorizedCreatorRequired()
      }, {
        email: payload.email,
        username: seedAccount.getUsername(),
        pubKey: seedAccount.getPubKey(),
        attributes: payload.attributes,
        ...{ roles: wrapInArray(payload.roles) }
      }));
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

        const ownerAuth = {
          weight_threshold: 1,
          account_auths: [],
          key_auths: [[newPublicKey, 1]]
        };

        const data = {
          ...initiator,
          ownerAuth
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
