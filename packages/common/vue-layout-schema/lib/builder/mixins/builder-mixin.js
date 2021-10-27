import { deepFindParentByValue } from '@deip/toolbox';
import { getters, mutations } from '../store';

export const BuilderMixin = {
  name: 'BuilderMixin',

  inject: ['containerId'],

  computed: {
    containerBlocks() { return getters.blocks(this.containerId); },
    containerSchema() { return getters.schema(this.containerId); },
    containerActiveNode() { return getters.activeNode(this.containerId); }
  },

  watch: {
    containerActiveNode: {
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.selectNode(newVal);
        }
      }
    }
  },

  methods: {
    setContainerActiveNode(nodeId) {
      mutations.setContainerActiveNode(this.containerId, nodeId);
    },

    updateContainerSchema(schema) {
      mutations.updateContainerSchema(this.containerId, schema);
    },

    removeContainerNode(nodeId) {
      mutations.removeContainerSchemaNode(this.containerId, nodeId);
    },

    getContainerNodeInfo(id) {
      return deepFindParentByValue(this.containerBlocks, id);
    },

    selectNode() { return true; }
  }
};
