import {
  cloneDeep,
  isEqual
} from '@deip/toolbox/lodash';
import { getters, mutations } from '../store';

export const BuilderMixin = {
  name: 'BuilderMixin',

  inject: ['containerId'],

  data() {
    return {
      schemaAcc: null
    };
  },

  computed: {
    containerSchema() { return getters.containerSchema(this.containerId); },
    containerBlocks() { return getters.containerBlocks(this.containerId); },
    containerBlocksList() { return getters.containerBlocksList(this.containerId); },
    containerActiveNode() { return getters.containerActiveNode(this.containerId); },

    internalSchema: {
      get() {
        return getters.containerSchema(this.containerId);
      },
      set(value) {
        this.setContainerSchema(value);
      }
    }
  },

  watch: {
    containerActiveNode: {
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.selectNode(newVal);
        }
      }
    },

    containerSchema: {
      handler(newVal) {
        if (!isEqual(this.schemaAcc, newVal)) {
          this.schemaAcc = cloneDeep(newVal);
        }
      },
      deep: true,
      immediate: true
    },

    schemaAcc: {
      handler(newVal) {
        this.setContainerSchema(newVal);
      },
      deep: true,
      immediate: true
    }
  },

  methods: {
    setContainerActiveNode(nodeId) {
      mutations.setContainerActiveNode(this.containerId, nodeId);
    },

    setContainerSchema(schema) {
      mutations.setContainerSchema(this.containerId, schema);
    },

    removeContainerNode(nodeId) {
      mutations.removeContainerSchemaNode(this.containerId, nodeId);
    },

    getContainerNodeInfo(id) {
      return this.containerBlocksList.find((b) => b.id === id);
    },

    selectNode() { return true; }
  }
};
