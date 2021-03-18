import deipRpc from '@deip/rpc-client';
import crypto from '@deip/lib-crypto';

import { wrapInArray } from '@deip/toolbox';

import { proxydi } from '@deip/proxydi';
import { AccessService } from '@deip/access-service';
import { AuthService } from '@deip/auth-service';
import { UsersService } from '@deip/users-service';

const accessService = AccessService.getInstance();
const authService = AuthService.getInstance();
const usersService = UsersService.getInstance();

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
  isLoggedIn: false
};

const GETTERS = {
  username: (state) => state.username,
  isLoggedIn: (state) => state.isLoggedIn
};

const ACTIONS = {

  restoreData({ commit }) {
    if (accessService.isLoggedIn()) {
      commit('setData', {
        username: accessService.getDecodedToken().username,
      });
    }
  },

  signIn({ commit, dispatch }, { username, password }) {
    let privateKey;

    return usersService.getUser(username)
      .then(({ account }) => {
        if (!account) {
          throw new Error('invalid account');
        }

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
      .then(async (response) => {
        if (!response.success) {
          dispatch('clear');
          throw new Error(response.error);
        }

        commit('setData', {
          jwtToken: response.jwtToken,
          privateKey
        });

        dispatch('currentUser/get', null, { root: true });

        return response;
      });
  },

  signUp({ commit }, payload) {
    const { ownerPubkey: pubKey } = deipRpc.auth.getPrivateKeys(
      payload.username,
      payload.password,
      ['owner']
    );

    return authService.signUp({
      pubKey,
      ...payload,
      ...{
        roles: wrapInArray(payload.roles)
      }
    });
  },

  signOut({ dispatch }) {
    dispatch('clear');
    window.location.reload();
  },

  clear({ commit }) {
    commit('clearData')
    commit('currentUser/clearData', null, { root: true });
  }

};

const MUTATIONS = {
  setData(state, { jwtToken, privateKey }) {

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
  }
};

export const authStore = {
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS,
  namespaced: true
};
