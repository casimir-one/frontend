import { NonFungibleTokenService } from '@casimir/token-service';

import {
  listGetter,
  oneGetter,
  setListMutation,
  setOneMutation
} from '@deip/platform-util';

const nonFungibleTokenService = NonFungibleTokenService.getInstance();

const STATE = {
  data: []
};

const GETTERS = {
  list: listGetter,
  one: oneGetter
};

const ACTIONS = {
  async getList({ commit }) {
    const res = await nonFungibleTokenService.getNftItemsList();
    commit('setList', res.data.items);
  },

  async getListByNftCollectionId({ commit }, nftCollectionId) {
    const res = await nonFungibleTokenService.getNftItemsListByNftCollection(nftCollectionId);
    commit('setList', res.data.items);
  },

  async getOne({ commit }, payload) {
    const { nftCollectionId, nftItemId } = payload;
    const res = await nonFungibleTokenService.getNftItem(nftCollectionId, nftItemId);
    commit('setOne', res.data);
  },

  async getListPaginated({ commit }, query) {
    const res = await nonFungibleTokenService.getNftItemsListPaginated(query);
    commit('setList', res.data.items);
    return res.data;
  }
};

const MUTATIONS = {
  setList: setListMutation,
  setOne: setOneMutation
};

export const nftItemsStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
