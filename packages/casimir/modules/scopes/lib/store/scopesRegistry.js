import {
  listGetterFactory,
  oneGetterFactory,
  setOneMutationFactory
} from '@casimir/platform-util';
import { collectionMerge, collectionOne } from '@casimir/toolbox';

const STATE = {
  data: []
};

const GETTERS = {
  list: listGetterFactory(),
  one: oneGetterFactory({ selectorKey: 'type' }),

  listForSelector: (_, getters) => (query) => getters.list(query)
    .map(({ type, label }) => ({ text: label || type, value: type }))
};

const ACTIONS = {
  addScope({ commit }, payload) {
    commit('setScope', payload);
  },

  addMappedKeys({ commit }, payload) {
    commit('setMappedKeys', payload);
  }
};

const MUTATIONS = {
  setScope: setOneMutationFactory({ mergeKey: 'type' }),

  setMappedKeys: (state, payload) => {
    const { scope, target, keys } = payload;
    const targetScope = collectionOne(state.data, { type: scope });

    if (!targetScope) {
      throw new Error(
        `[ScopesRegistry]: can't set mapped keys for "${scope}" scope. Scope doesn't exist.`
      );
    }

    targetScope.mappedKeys[target] = collectionMerge(
      targetScope.mappedKeys[target],
      keys,
      { key: 'key' }
    );

    state.data = collectionMerge(
      state.data,
      targetScope,
      { key: 'type' }
    );
  }
};

export const scopesRegistry = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
