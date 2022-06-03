import {
  cloneDeep,
  isEqual
} from 'lodash';
import { getters, mutations } from '../store';

/**
 * @typedef {Object} Block
 * @property {string} blockType
 * @property {Object} [data]
 * @property {Array.<string>} [disabledProps]
 * @property {string} icon
 * @property {string} id
 * @property {string} is
 * @property {string} [layoutType]
 * @property {string} name
 * @property {Array.<string>} [scope]
 * @property {string} [text]
 */

/**
 * Builder mixin
 */
export const BuilderMixin = {
  name: 'BuilderMixin',

  inject: ['containerId'],

  data() {
    return {
      schemaAcc: null
    };
  },

  computed: {
    /**
     * Container schema
     * @returns {Array}
     */
    containerSchema() { return getters.containerSchema(this.containerId); },
    /**
     * Container grouped blocks
     * @returns {Array.<Object>} result
     * @returns {string} result.title
     * @returns {Array.<Blocks>} result.blocks
     */
    containerBlocks() { return getters.containerBlocks(this.containerId); },
    /**
     * Container blocks list
     * @returns {Array.<Block>}
     */
    containerBlocksList() { return getters.containerBlocksList(this.containerId); },
    /**
     * Container active node
     * @returns {string}
     */
    containerActiveNode() { return getters.containerActiveNode(this.containerId); },

    /**
     * Internal schema
     */
    internalSchema: {
      /**
       * Get schema
       * @returns {Array}
       */
      get() {
        return getters.containerSchema(this.containerId);
      },
      /**
       * Set schema
       * @param {Array} value
       */
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
    /**
     * Set container active node
     * @param {string} nodeId
     */
    setContainerActiveNode(nodeId) {
      mutations.setContainerActiveNode(this.containerId, nodeId);
    },

    /**
     * Set container schema
     * @param {Array.<SchemaNode>} schema
     */
    setContainerSchema(schema) {
      mutations.setContainerSchema(this.containerId, schema);
    },

    /**
     * Remove node from schema
     * @param {string} nodeId
     */
    removeContainerNode(nodeId) {
      mutations.removeContainerSchemaNode(this.containerId, nodeId);
    },

    /**
     * Get block info
     * @param {string} id
     * @returns {Block}
     */
    getContainerNodeInfo(id) {
      return this.containerBlocksList.find((b) => b.id === id);
    },

    /**
     * Select node base method
     * @returns {boolean}
     */
    selectNode() { return true; }
  }
};
