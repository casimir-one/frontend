import { AssetsService } from '@deip/assets-service';

import {
  listGetter,
  setListMutationFactory
} from '@deip/platform-fns';

import { ASSET_TYPE } from '../constants';

const assetsService = AssetsService.getInstance();

const STATE = {
  data: []
};

const GETTERS = {
  list: listGetter
};

const ACTIONS = {
  getList({ commit, rootGetters }) {
    const assets = rootGetters['assets/list'];

    const balancesPromises = assets
      .filter((asset) => asset.type === ASSET_TYPE.TOKEN)
      .map((asset) => assetsService.getAccountsAssetBalancesByAsset(asset.stringSymbol));

    return Promise.all(balancesPromises)
      .then((balances) => {
        commit('setList', balances.flat(1));
      });
  }
};

const MUTATIONS = {
  setList: setListMutationFactory({ mergeKey: 'id' })
};

export const balancesStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
