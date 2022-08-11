import { NonFungibleTokenService } from '@casimir/token-service';
import {
  listGetter,
  oneGetter,
  setListMutation,
  setOneMutation
} from '@casimir/platform-util';

const nonFungibleTokenService = NonFungibleTokenService.getInstance();

const STATE = {
  data: []
};

const GETTERS = {
  list: listGetter,
  one: oneGetter
};

const ACTIONS = {
  getList({ dispatch }, payload = {}) {
    const {
      issuer,
      portalId,
      ids,
      filter
    } = payload;

    if (issuer) return dispatch('getListByIssuer', issuer);
    if (ids && ids.length) return dispatch('getListByIds', ids);
    if (portalId) return dispatch('getListByPortalId', portalId);

    return dispatch('getFilteredList', filter);
  },

  async getFilteredList({ commit }, filter = {}) {
    const res = await nonFungibleTokenService.getNftCollectionsList(filter);
    commit('setList', res.data.items);
  },

  async getListByIssuer({ commit }, issuer) {
    const res = await nonFungibleTokenService.getNftCollectionsListByIssuer(issuer);
    commit('setList', res.data.items);
  },

  async getListByIds({ commit }, ids) {
    const res = await nonFungibleTokenService.getNftCollectionsListByIds(ids);
    commit('setList', res.data.items);
  },

  async getListByPortalId({ commit }, portalId) {
    const res = await nonFungibleTokenService.getPortalNftCollectionList(portalId);
    commit('setList', res.data.items);
  },

  async getOne({ commit }, nftCollectionId) {
    const res = await nonFungibleTokenService.getNftCollection(nftCollectionId);
    commit('setOne', res.data);
  },

  async create({ dispatch }, payload) {
    const res = await nonFungibleTokenService.createNftCollection(payload);

    dispatch('getOne', res.data._id);
    return res.data;
  },

  async update({ dispatch }, payload) {
    const res = await nonFungibleTokenService.updateNftCollectionMetadata(payload);
    dispatch('getOne', res.data._id);
    return res.data;
  }
};

const MUTATIONS = {
  setList: setListMutation,
  setOne: setOneMutation
};

export const nftCollectionsStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
