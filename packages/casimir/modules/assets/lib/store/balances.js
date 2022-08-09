import BigNumber from 'bignumber.js';

import { proxydi } from '@deip/proxydi';
import { FungibleTokenService } from '@casimir/token-service';
import { listGetter, setListMutationFactory } from '@deip/platform-util';
import { AssetType } from '@casimir/platform-core';

const fungibleTokenService = FungibleTokenService.getInstance();

const STATE = {
  data: [],
  balance: {}
};

const GETTERS = {
  list: listGetter,

  balance: (state) => state.balance
};

const ACTIONS = {
  getList({ commit, rootGetters, dispatch }, payload = {}) {
    const { withAssetsFetch = true } = payload;

    const loadBalances = (assets) => {
      const balancesPromises = assets
        .filter((asset) => asset.type === AssetType.FT)
        .map((asset) => fungibleTokenService.getAccountsBalancesBySymbol(asset.symbol));

      return Promise.all(balancesPromises)
        .then((balancesResponses) => {
          commit('setList', balancesResponses.map((b) => b.data.items).flat(1));
        });
    };

    if (withAssetsFetch) {
      return dispatch('assets/getList', null, { root: true })
        .then(() => loadBalances(rootGetters['assets/list']()));
    }
    return loadBalances(rootGetters['assets/list']());
  },

  async getBalance({ commit }, address) {
    const env = proxydi.get('env');

    const balance = await fungibleTokenService.getAccountDaoBalance(address, env.CORE_ASSET.id);

    if (balance) {
      commit('setBalance', {
        ...balance,
        amount: new BigNumber(balance.amount)
          .shiftedBy(-balance.precision)
          .toFormat(BigNumber.ROUND_FLOOR)
      });
    }
  }
};

const MUTATIONS = {
  setList: setListMutationFactory({ mergeKey: 'assetId' }),
  setBalance(state, data) {
    state.balance = data;
  }
};

export const balancesStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
