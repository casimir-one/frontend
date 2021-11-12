import { AssetsService } from '@deip/assets-service';

import {
  listGetter,
  oneGetterFactory,
  setListMutationFactory,
  setOneMutationFactory
} from '@deip/platform-store';

const assetsService = AssetsService.getInstance();

const STATE = {
  data: []
};

const GETTERS = {
  list: listGetter,

  listKeys: (_, getters) => (query = {}) => getters.list(query)
    .map((ass) => ass.symbol),

  one: oneGetterFactory({ selectorKey: 'symbol' })
};

const ACTIONS = {
  getList({ commit }) {
    return assetsService.lookupAssets('', 10000)
      .then((data) => {
        commit('setList', data);
      });
  },

  getBySymbol({ commit }, assetSymbol) {
    return assetsService.getAssetBySymbol(assetSymbol)
      .then((asset) => {
        commit('setOne', asset);
      });
  },

  create(_, payload) {
    const { user, data } = payload;
    return assetsService.createAsset(user, data);
  }
};

const MUTATIONS = {
  setList: setListMutationFactory({ mergeKey: '_id' }),
  setOne: setOneMutationFactory({ mergeKey: '_id' })
};

export const assetsStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
