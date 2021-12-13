import { LayoutService } from '@deip/layout-service';

import {
  crudGettersFactory,
  crudMutationsFactory
} from '@deip/platform-store';
import { collectionOne } from '@deip/toolbox';

const layoutService = LayoutService.getInstance();

const STATE = {
  data: [],
  settings: {}
};

const GETTERS = {
  ...crudGettersFactory({ dataKey: '_id' }),

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
        commit('setList', res);
      });
  },

  getOne({ commit }, _id) {
    return layoutService.getOne(_id)
      .then((res) => {
        commit('setOne', res);
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
    return layoutService.getSettings(window.env.TENANT)
      .then((res) => {
        commit('setSettings', res);
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
  ...crudMutationsFactory({ dataKey: '_id' }),

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
