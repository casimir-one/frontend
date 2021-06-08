import { AttributesService, ATTR_SCOPES } from '@deip/attributes-service';

import {
  listGetter,
  oneGetterFactory,
  setListMutationFactory,
  setOneMutationFactory,
  removeFromListMutationFactory
} from '@deip/platform-fns';
import { collectionOne, createFormData } from '@deip/toolbox';

const attributesService = AttributesService.getInstance();
const idKey = '_id';

const STATE = {
  data: [],
  settings: {}
};

const GETTERS = {
  list: listGetter,
  one: oneGetterFactory({ selectorKey: idKey }),
  listByScopes: (state) => {
    const initialListByScopes = {
      [ATTR_SCOPES.PROJECT]: [],
      [ATTR_SCOPES.TEAM]: [],
      [ATTR_SCOPES.USER]: []
    };

    return state.data.reduce((acc, current) => {
      acc[current.scope].push(current);
      return acc;
    }, initialListByScopes);
  },

  map: (state) => (key) => collectionOne(state.settings.map || [], { key })
};

const ACTIONS = {
  getList({ commit }) {
    return attributesService.getAttributes()
      .then((result) => {
        commit('setList', result);
      });
  },

  getNetworkList({ commit }) {
    return attributesService.getNetworkAttributes()
      .then((result) => {
        commit('setList', result);
      });
  },

  getOne({ commit }, attributeId) {
    return attributesService.getAttribute(attributeId)
      .then((result) => {
        commit('setOne', result);
      });
  },

  create({ dispatch }, attribute) {
    return attributesService.createAttribute(attribute)
      .then(() => {
        dispatch('getList');
      });
  },

  update({ dispatch }, attribute) {
    return attributesService.updateAttribute(attribute)
      .then(() => {
        dispatch('getList');
      });
  },

  remove({ commit }, attributeId) {
    return attributesService.deleteAttribute(attributeId)
      .then(() => {
        commit('remove', attributeId);
      });
  },

  getSettings({ commit }) {
    return attributesService.getSettings(window.env.TENANT)
      .then((res) => {
        commit('setSettings', res);
      });
  },

  updateSettings({ dispatch, rootGetters }, payload) {
    const newSettings = createFormData({
      ...rootGetters['currentTenant/data'].profile.settings,
      ...{
        attributes: payload
      }
    });

    return attributesService.updateSettings(newSettings)
      .then(() => {
        dispatch('getSettings');
      });
  }
};

const MUTATIONS = {
  setList: setListMutationFactory({ mergeKey: idKey }),
  setOne: setOneMutationFactory({ mergeKey: idKey }),
  remove: removeFromListMutationFactory({ mergeKey: idKey }),

  setSettings(state, payload) {
    state.settings = {
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
