import { LayoutService } from '@deip/layout-service';

import {
  crudGettersFactory,
  crudMutationsFactory
} from '@deip/platform-store';

const layoutService = LayoutService.getInstance();

const STATE = {
  data: []
};

const GETTERS = {
  ...crudGettersFactory({ dataKey: '_id' })
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
  }
};

const MUTATIONS = {
  ...crudMutationsFactory({ dataKey: '_id' })
};

export const layoutsStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
