import { AttributesService } from '@casimir/attributes-service';

import {
  listGetter,
  oneGetter,
  setListMutation,
  setOneMutation,
  removeFromListMutation
} from '@casimir/platform-util';
import { collectionOne } from '@casimir/toolbox';

const attributesService = AttributesService.getInstance();

const STATE = {
  data: [],
  settings: {}
};

const GETTERS = {
  list: listGetter,
  one: oneGetter,
  listByScopes: (state) => {
    const initialListByScopes = {
      project: [],
      team: [],
      user: []
    };

    return state.data.reduce((acc, current) => {
      acc[current.scope].push(current);
      return acc;
    }, initialListByScopes);
  },

  settings: (state) => state.settings,
  mappedId: (state) => (key) => collectionOne(state.settings.mappedKeys || [], { key })?.value
};

const ACTIONS = {
  async getList({ commit }) {
    const res = await attributesService.getList();
    commit('setList', res.data.items);
  },

  async getNetworkList({ commit }) {
    const res = await attributesService.getNetworkAttributes();
    commit('setList', res.data.items);
  },

  async getOne({ commit }, attributeId) {
    const res = await attributesService.getOne(attributeId);
    commit('setOne', res.data);
  },

  async create({ dispatch }, attribute) {
    await attributesService.create(attribute);
    dispatch('getList');
  },

  async update({ dispatch }, attribute) {
    await attributesService.update(attribute);
    dispatch('getList');
  },

  async remove({ commit }, attributeId) {
    await attributesService.delete(attributeId);
    commit('remove', attributeId);
  },

  async getSettings({ commit }) {
    const res = await attributesService.getSettings(window.env.TENANT);
    commit('setSettings', res.data);
  },

  async updateSettings({ dispatch }, payload) {
    await attributesService.updateSettings(payload);
    dispatch('getSettings');
  }
};

const MUTATIONS = {
  setList: setListMutation,
  setOne: setOneMutation,
  remove: removeFromListMutation,

  setSettings(state, payload) {
    state.settings = state.settings === null
      ? payload
      : {
        ...state.settings,
        ...payload
      };
  }
};

export const attributesStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
