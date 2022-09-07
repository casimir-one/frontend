import { collectionMerge, collectionOne, hasOwnProperty } from '@casimir.one/toolbox';

const STATE = {
  blocks: [],
  components: {}
};

const GETTERS = {
  blocks: (state) => state.blocks,
  blocksSection: (state) => (sectionTitle) => collectionOne(state.blocks, { title: sectionTitle }),
  components: (state) => state.components
};

const MUTATIONS = {
  addBlocks(state, payload = {}) {
    const {
      blocks: registeredBlocks = []
    } = state.blocks.find((s) => s.title === payload.title) || {};

    const updated = {
      title: payload.title,
      blocks: collectionMerge(registeredBlocks, payload.blocks, { key: 'name' })
    };

    state.blocks = collectionMerge(state.blocks, [updated], { key: 'title' });
  },

  addComponents(state, payload = {}) {
    for (const [key, component] of Object.entries(payload)) {
      if (hasOwnProperty(key, state.components)) {
        console.warn(`[layoutsRegistry]: component ${key} already registered`);
      } else {
        state.components = { ...state.components, [key]: component };
      }
    }
  }
};

export const layoutsRegistry = {
  namespaced: true,
  state: STATE,
  getters: GETTERS,
  mutations: MUTATIONS
};
