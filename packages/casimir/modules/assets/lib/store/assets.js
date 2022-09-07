import { FungibleTokenService } from '@casimir.one/token-service';

import {
  listGetter,
  oneGetterFactory,
  setListMutation,
  setOneMutation
} from '@casimir.one/platform-util';

const fungibleTokenService = FungibleTokenService.getInstance();

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
    return fungibleTokenService.getList()
      .then((res) => {
        commit('setList', res.data.items);
      });
  },

  getBySymbol({ commit }, symbol) {
    return fungibleTokenService.getOneBySymbol(symbol)
      .then((res) => {
        commit('setOne', res.data);
      });
  },

  async create({ dispatch }, payload) {
    await fungibleTokenService.create(payload);
    await dispatch('balances/getList', { withAssetsFetch: true }, { root: true });
  }
};

const MUTATIONS = {
  setList: setListMutation,
  setOne: setOneMutation
};

export const assetsStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
