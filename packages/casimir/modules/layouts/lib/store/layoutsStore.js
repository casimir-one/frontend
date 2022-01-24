import { LayoutService } from '@deip/layout-service';

import {
  crudGetters,
  crudMutations
} from '@deip/platform-store';
import { collectionOne } from '@deip/toolbox';

const layoutService = LayoutService.getInstance();

const STATE = {
  data: [],
  settings: {}
};

const GETTERS = {
  ...crudGetters,

  settings: (state) => state.settings,
  mappedId: (state) => (key) => collectionOne(state.settings.mapping || [], { key })?.value
};

const ACTIONS = {
  getList({ commit }, force) {
    return layoutService.getLayouts()
      .then((res) => {
        if (force) {
          commit('clearList');
        }
        commit('setList', res.data.items);
      });
  },

  getOne({ commit }, _id) {
    return layoutService.getOne(_id)
      .then((res) => {
        commit('setOne', res.data);
      });
  },

  create({ dispatch }, payload) {
    return layoutService.create(payload)
      .then(() => {
        dispatch('getList');
      });
  },

  update({ dispatch }, payload) {
    const { _id } = payload;

    return layoutService.update(_id, payload)
      .then(() => {
        dispatch('getOne', _id);
      });
  },

  remove({ commit }, payload) {
    const { _id } = payload;

    return layoutService.remove(_id)
      .then(() => {
        commit('removeFromList', _id);
      });
  },

  getSettings({ commit }) {
    return layoutService.getSettings(this._vm.$env.TENANT)
      .then((res) => {
        commit('setSettings', res.data);
      });
  },

  updateSettings({ dispatch }, payload) {
    return layoutService.updateSettings(payload)
      .then(() => {
        dispatch('getSettings');
      });
  }
};

const MUTATIONS = {
  ...crudMutations,

  setSettings(state, payload) {
    state.settings = state.settings === null
      ? { ...payload }
      : {
        ...state.settings,
        ...payload
      };
  }
};

export const layoutsStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
