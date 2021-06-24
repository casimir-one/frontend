import { AssetsService } from '@deip/assets-service';

import {
  clearMutation,
  listGetter,
  oneGetterFactory,
  setListMutationFactory
} from '@deip/platform-fns';

const assetsService = AssetsService.getInstance();

const STATE = {
  data: []
};

const GETTERS = {
  list: listGetter,
  one: oneGetterFactory({ selectorKey: 'assetSymbol' })
};

const ACTIONS = {
  get({ commit, rootGetters }) {
    if (!rootGetters['auth/isLoggedIn']) {
      return Promise.resolve(false);
    }

    return assetsService.getAccountAssetsBalancesByOwner(rootGetters['auth/username'])
      .then((balances) => {
        commit('setList',
          balances.filter((balance) => !balance.tokenized_research));
      });
  },

  clear({ commit }) {
    commit('clear');
  }
};

const MUTATIONS = {
  setList: setListMutationFactory({ mergeKey: 'id' }),
  clear: clearMutation
};

export const currentUserBalancesStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
