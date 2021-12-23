import { AssetsService } from '@deip/assets-service';

import {
  clearMutation,
  listGetter,
  oneGetterFactory,
  setListMutationFactory
} from '@deip/platform-store';
import { ASSET_TYPE } from '@deip/constants';

const assetsService = AssetsService.getInstance();

const STATE = {
  data: [],
  history: []
};

const GETTERS = {
  list: listGetter,
  one: oneGetterFactory({ selectorKey: 'symbol' }),
  history: (state) => state.history
};

const ACTIONS = {
  get({ commit, rootGetters }) {
    if (!rootGetters['auth/isLoggedIn']) {
      return Promise.resolve(false);
    }

    return assetsService.getAccountAssetsBalancesByOwner(rootGetters['auth/username'])
      .then((balances) => {
        commit('setList',
          balances.filter((balance) => balance.type !== ASSET_TYPE.NFT));
      });
  },

  clear({ commit }) {
    commit('clear');
  },

  deposit(_, payload) {
    return assetsService.depositAssets(payload);
  },

  getHistory({ commit }, payload) {
    const {
      account,
      status
    } = payload;
    return assetsService.getAccountDepositHistory(account, status)
      .then((res) => {
        commit('setHistory', res);
      });
  }
};

const MUTATIONS = {
  setList: setListMutationFactory({ mergeKey: 'assetId' }),
  clear: clearMutation,
  setHistory: (state, payload) => {
    state.history = payload;
  }
};

export const walletStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
