import { LayoutService } from '@deip/layout-service';

import {
  listGetterFactory,
  oneGetterFactory,
  setListMutationFactory,
  setOneMutationFactory,
  removeFromListMutationFactory,
  clearMutationFactory
} from '@deip/platform-util';
import { collectionOne } from '@deip/toolbox';

const layoutService = LayoutService.getInstance();

const STATE = {
  data: [],
  settings: {}
};

const GETTERS = {
  list: listGetterFactory(),
  one: oneGetterFactory(),

  settings: (state) => state.settings,
  mappedId: (state) => (key) => collectionOne(state.settings.mappedKeys || [], { key })?.value
};

const ACTIONS = {
  getList({ commit }, force) {
    return layoutService.getList()
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
    return layoutService.update(payload)
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
  setList: setListMutationFactory(),
  setOne: setOneMutationFactory(),
  removeFromList: removeFromListMutationFactory(),
  clearList: clearMutationFactory(),

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
