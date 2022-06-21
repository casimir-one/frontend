import { NonFungibleTokenService } from '@casimir/token-service';

import {
  listGetter,
  oneGetter,
  setListMutation,
  setOneMutation,
  removeFromListMutation
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
  async getListByProjectId({ commit }, projectId) {
    const res = await nonFungibleTokenService.getNftItemMetadataDraftsByNftCollection(projectId);
    commit('setList', res.data.items);
  },

  async getListPaginated({ commit }, query) {
    const res = await nonFungibleTokenService.getNftItemMetadataDraftsListPaginated(query);
    commit('setList', res.data.items);
    return res.data;
  },

  async getOne({ commit }, id) {
    const res = await nonFungibleTokenService.getNftItemMetadataDraft(id);
    commit('setOne', res.data);
  },

  async create(_, payload) {
    return nonFungibleTokenService.createNftItemMetadataDraft(payload);
  },

  async update(_, payload) {
    return nonFungibleTokenService.updateNftItemMetadataDraft(payload);
  },

  async sellLazy(_, payload) {
    await nonFungibleTokenService.sellLazy(payload);
  },

  async buyLazy(_, payload) {
    await nonFungibleTokenService.buyLazy(payload);
  },

  async remove({ commit }, id) {
    await nonFungibleTokenService.deleteNftItemMetadataDraft(id);
    commit('remove', id);
  },

  async publish({ commit }, payload) {
    const {
      initiator,
      data: {
        _id,
        projectId,
        teamId,
        contentType,
        title,
        authors,
        references,
        hash
      }
    } = payload;

    await nonFungibleTokenService.createNftItem(
      {
        initiator,
        data: {
          _id,
          projectId,
          teamId,
          contentType,
          title,
          authors,
          references,
          hash,
          content: hash
        },
        proposalInfo: { isProposal: false }
      }
    );
    commit('remove', _id);
  },

  moderate(_, payload) {
    return nonFungibleTokenService.moderateNftItemMetadataDraft(payload);
  }
};

const MUTATIONS = {
  setList: setListMutation,
  setOne: setOneMutation,
  remove: removeFromListMutation
};

export const projectContentDraftsStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
