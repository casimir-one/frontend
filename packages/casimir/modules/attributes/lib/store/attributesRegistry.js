import {
  listGetterFactory,
  oneGetterFactory,
  setOneMutationFactory
} from '@deip/platform-util';
import { baseAttributes } from '../config';

const STATE = {
  data: baseAttributes
};

const GETTERS = {
  list: listGetterFactory(),
  one: oneGetterFactory({ selectorKey: 'type' })
};

const ACTIONS = {
  addAttribute({ commit }, payload) {
    commit('setAttribute', payload);
  }
};

const MUTATIONS = {
  setAttribute: setOneMutationFactory({ mergeKey: 'type' })
};

export const attributesRegistry = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  actions: ACTIONS,
  mutations: MUTATIONS
};
