// eslint-disable-next-line import/no-unresolved
import Vue from 'vue';
import { deepFindParentByValue, objectPath } from '@deip/toolbox';

export const state = Vue.observable({});

export const getters = {
  container: (containerId) => state?.[containerId],

  containerBlocks: (containerId) => state?.[containerId]?.blocks || [],
  containerSchema: (containerId) => state?.[containerId]?.schema || [],
  containerActiveNode: (containerId) => state?.[containerId]?.activeNode
};

export const mutations = {
  createContainer(containerId) {
    state[containerId] = Vue.observable({
      schema: [],
      activeNode: null,
      blocks: []
    });
  },

  removeContainer(containerId) {
    delete state[containerId];
  },

  setContainerBlocks(containerId, blocks) {
    state[containerId].blocks = blocks;
  },

  setContainerActiveNode(containerId, nodeId) {
    state[containerId].activeNode = nodeId;
  },

  setContainerSchema(containerId, schema) {
    state[containerId].schema = schema;
  },

  removeContainerSchemaNode(containerId, nodeId) {
    const schema = getters.containerSchema(containerId);
    const { path } = deepFindParentByValue(schema, nodeId, true);
    objectPath.del(schema, path);

    mutations.setContainerSchema(containerId, schema);
    mutations.setContainerActiveNode(containerId, null);
  }

};
