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
    .map((ass) => ass.stringSymbol),

  one: oneGetterFactory({ selectorKey: 'stringSymbol' })
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

  createProjectSecurityToken(_, payload) {
    return assetsService.createAsset(...payload);
  }
};

const MUTATIONS = {
  setList: setListMutationFactory({ mergeKey: 'stringSymbol' }),
  setOne: setOneMutationFactory({ mergeKey: 'stringSymbol' })
};

export const assetsStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
