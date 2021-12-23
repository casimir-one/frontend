import { AssetsService } from '@deip/assets-service';

import {
  listGetter,
  setListMutationFactory
} from '@deip/platform-store';

import { ASSET_TYPE } from '@deip/constants';

const assetsService = AssetsService.getInstance();

const STATE = {
  data: []
};

const GETTERS = {
  list: listGetter
};

const ACTIONS = {
  getList({ commit, rootGetters, dispatch }, payload = {}) {
    const { withAssetsFetch = true } = payload;

    const loadBalances = (assets) => {
      const balancesPromises = assets
        .filter((asset) => asset.type === ASSET_TYPE.NFT)
        .map((asset) => assetsService
          .getAccountsAssetBalancesByAsset(asset.symbol));

      return Promise.all(balancesPromises)
        .then((balances) => {
          commit('setList', balances.flat(1));
        });
    };

    if (withAssetsFetch) {
      return dispatch('assets/getList', null, { root: true })
        .then(() => loadBalances(rootGetters['assets/list']()));
    }
    return loadBalances(rootGetters['assets/list']());
  }
};

const MUTATIONS = {
  setList: setListMutationFactory({ mergeKey: 'assetId' })
};

export const balancesStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
