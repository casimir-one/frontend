import deipRpc from '@deip/rpc-client';
import crypto from '@deip/lib-crypto';

import { proxydi } from '@deip/proxydi';
import { AuthService } from '@deip/auth-service';
import { UserService } from '@deip/user-service';
import { AccessService } from '@deip/access-service';
import { wrapInArray, genRipemd160Hash } from '@deip/toolbox';

const accessService = AccessService.getInstance();
const authService = AuthService.getInstance();
const userService = UserService.getInstance();

const encodeUint8Arr = (inputString) => new TextEncoder('utf-8').encode(inputString);

const getPrivateKeyRole = (privateKey, account) => {
  const publicKey = deipRpc.auth.wifToPublic(privateKey);

  for (const role of ['owner', 'active']) {
    if (account[role].key_auths[0].includes(publicKey)) {
      return role;
    }
  }

  return null;
};

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

  signIn({ commit, dispatch }, { username: usernameOrEmail, password }) {
    let privateKey;

    return userService.checkIfUserExists(usernameOrEmail)
      .then((exists) => {
        if (!exists) {
          throw new Error('No such user exists');
        }
        return userService.getUser(usernameOrEmail);
      })
      .then(({ account, username }) => {
        if (deipRpc.auth.isWif(password) && getPrivateKeyRole(password, account)) {
          privateKey = password;
        } else {
          privateKey = deipRpc.auth.toWif(
            username,
            password,
            'owner'
          );
        }

        let secretKey;

        try {
          secretKey = crypto.PrivateKey.from(privateKey);
        } catch (err) {
          dispatch('clear');
          throw new Error('invalid key');
        }

        const secretSig = secretKey.sign(encodeUint8Arr(proxydi.get('env').SIG_SEED).buffer);

        return authService.signIn({
          username,
          secretSigHex: crypto.hexify(secretSig)
        });
      })
      .then((response) => {
        if (!response.success) {
          dispatch('clear');
          throw new Error(response.error);
        }

        commit('setData', {
          jwtToken: response.jwtToken,
          privateKey
        });
      });
  },

  signUp(_, payload) {
    const { email, password } = payload;

    return userService.checkIfUserExists(email)
      .then((exists) => {
        if (exists) {
          throw new Error('User with such email exists');
        }
      })
      .then(() => {
        const username = genRipemd160Hash(email);
        const { ownerPubkey: pubKey } = deipRpc.auth.getPrivateKeys(
          username,
          password,
          ['owner']
        );

        return authService.signUp({
          pubKey,
          username,
          ...payload,
          ...{
            roles: wrapInArray(payload.roles)
          }
        });
      });
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
    let oldPrivateKey;

    try {
      if (deipRpc.auth.isWif(oldPassword)
      && deipRpc.auth.wifToPublic(initiator.privKey) === initiator.pubKey) {
        // if old private key is entered

        oldPrivateKey = initiator.privKey;
      } else {
        // if old password is entered or old password is in private key format
        oldPrivateKey = deipRpc.auth.toWif(initiator.username, oldPassword, 'owner');
        const oldPublicKey = deipRpc.auth.wifToPublic(oldPrivateKey);

        // return if the public key from the password is not equal to the public key of the account
        if (initiator.pubKey !== oldPublicKey) throw new Error('Old password is invalid');
      }
    } catch (err) {
      return Promise.reject(err);
    }

    const {
      owner: newPrivateKey,
      ownerPubkey
    } = deipRpc.auth.getPrivateKeys(initiator.username, newPassword, ['owner']);

    const ownerAuth = {
      weight_threshold: 1,
      account_auths: [],
      key_auths: [[ownerPubkey, 1]]
    };

    const data = {
      ...initiator,
      accountOwnerAuth: ownerAuth,
      accountActiveAuth: ownerAuth
    };

    return userService.updateUser({ initiator, ...data })
      .then(() => dispatch('currentUser/get', null, { root: true })
        .then(() => accessService.setOwnerWif(newPrivateKey))
        .then(() => Promise.resolve({ privKey: newPrivateKey, pubKey: ownerPubkey })));
  }

};

const MUTATIONS = {
  setData(state, { jwtToken, privateKey } = {}) {
    if (jwtToken && privateKey) {
      accessService.setAccessToken(jwtToken, privateKey);
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