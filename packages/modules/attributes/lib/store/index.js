import { AttributesService, ATTR_SCOPES } from '@deip/attributes-service';

import {
  listGetter,
  oneGetterFactory,
  setListMutationFactory,
  setOneMutationFactory,
  removeFromListMutationFactory
} from '@deip/platform-fns';

const attributesService = AttributesService.getInstance();

const STATE = {
  data: []
};

const GETTERS = {
  list: listGetter,
  one: oneGetterFactory({ selectorKey: 'id' }),
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
  }
};

const ACTIONS = {
  getList({ commit }) {
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

  create({ commit }, attribute) {
    return attributesService.createAttribute(attribute)
      .then((result) => {
        commit('setOne', result);
      });
  },

  update({ commit }, attribute) {
    return attributesService.updateAttribute(attribute)
      .then((result) => {
        commit('setOne', result);
      });
  },

  remove({ commit }, attributeId) {
    return attributesService.deleteAttribute(attributeId)
      .then(() => {
        commit('remove', attributeId);
      });
  }
};

const MUTATIONS = {
  setList: setListMutationFactory({ mergeKey: 'id' }),
  setOne: setOneMutationFactory({ mergeKey: 'id' }),
  remove: removeFromListMutationFactory({ mergeKey: 'id' })
};

export const attributesStore = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
