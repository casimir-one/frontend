import { FungibleTokenService } from '@casimir/token-service';
import { AssetsService } from '@deip/assets-service';

import {
  clearMutation,
  listGetter,
  oneGetterFactory,
  setListMutationFactory
} from '@deip/platform-util';

const assetsService = AssetsService.getInstance();
const fungibleTokenService = FungibleTokenService.getInstance();

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
  async getBalances({ commit, rootGetters }) {
    if (rootGetters['auth/isLoggedIn']) {
      const res = await fungibleTokenService
        .getAccountBalancesByOwner(rootGetters['auth/username']);
      commit('setList', res.data.items);
    }
  },

  clear({ commit }) {
    commit('clear');
  },

  async deposit(_, payload) {
    const response = await assetsService.deposit(payload);
    return response.data;
  },

  getHistory({ commit }, payload) {
    const {
      account,
      status
    } = payload;
    return assetsService.getAccountDepositHistory(account, status)
      .then((res) => {
        commit('setHistory', res.data.items);
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
