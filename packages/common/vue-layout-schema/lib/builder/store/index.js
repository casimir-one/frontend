// eslint-disable-next-line import/no-unresolved
import Vue from 'vue';
import { deepFindParentByValue, objectPath } from '@deip/toolbox';

export const state = Vue.observable({});

export const getters = {
  container: (containerId) => state?.[containerId],
  schema: (containerId) => state?.[containerId]?.schema,
  blocks: (containerId) => state?.[containerId]?.blocks,
  activeNode: (containerId) => state?.[containerId]?.activeNode
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

  updateContainerSchema(containerId, schema) {
    state[containerId].schema = schema;
  },

  removeContainerSchemaNode(containerId, nodeId) {
    const schema = getters.schema(containerId);
    const { path } = deepFindParentByValue(schema, nodeId, true);
    objectPath.del(schema, path);

    mutations.updateContainerSchema(containerId, schema);
    mutations.setContainerActiveNode(containerId, null);
  }

};
