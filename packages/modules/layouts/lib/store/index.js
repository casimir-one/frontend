import { LayoutService } from '@deip/layout-service';

import {
  listGetter,
  oneGetterFactory,
  setListMutationFactory,
  setOneMutationFactory
} from '@deip/platform-fns';
import { isObject } from '@deip/toolbox';

const layoutService = LayoutService.getInstance();

const STATE = {
  data: []
};

const GETTERS = {
  list: listGetter,
  one: oneGetterFactory({ selectorKey: 'entityId' })
};

const ACTIONS = {
  getList({ commit }) {
    return layoutService.getLayouts()
      .then((res) => {
        commit(
          'setList',
          isObject(res)
            // temp fallback
            ? Object.keys(res).map((key) => ({ entityId: key, ...res[key] }))
            : res
        );
      });
  },

  getOne({ commit }, entityId) {
    return layoutService.getOne(entityId)
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
    const { entityId } = payload;

    return layoutService.update(entityId, payload)
      .then(() => {
        dispatch('getOne', entityId);
      });
  }
};

const MUTATIONS = {
  setList: setListMutationFactory({ mergeKey: 'entityId' }),
  setOne: setOneMutationFactory({ mergeKey: 'entityId' })
};

export const layoutsStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
