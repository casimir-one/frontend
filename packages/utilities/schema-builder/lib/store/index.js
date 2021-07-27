// eslint-disable-next-line import/no-unresolved
import Vue from 'vue';

const state = Vue.observable({ // this is the magic
  activeNode: null
});

export const getters = {
  activeNodeRe: () => state.activeNode
};

export const mutations = {
  setActiveNode(val) {
    state.activeNode = val;
  }
};
