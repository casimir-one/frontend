import { uuidv4 } from '@deip/toolbox';
import { isEqual } from '@deip/toolbox/lodash';

import { mutations, getters } from '../../store';
import { normalizeBlocksObject } from '../../utils/helpers';

/**
 * Builder container
 */
export default {
  name: 'VlsBuilderContainer',

  provide() {
    return {
      containerId: this.containerId
    };
  },

  model: {
    prop: 'value',
    event: 'change'
  },

  props: {
    /**
     * Blocks
     */
    blocks: {
      type: Array,
      default: () => []
    },
    /**
     * Value
     * @model
     */
    value: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      containerId: uuidv4(),
      ready: false
    };
  },

  computed: {
    /**
     * Container blocks
     * @returns {Array}
     */
    containerBlocks() { return getters.containerBlocks(this.containerId); },
    /**
     * Container schema
     * @returns {Array}
     */
    containerSchema() { return getters.containerSchema(this.containerId); },
    /**
     * Container active node
     * @returns {Object}
     */
    containerActiveNode() { return getters.containerActiveNode(this.containerId); }
  },

  created() {
    this.initContainer();
  },

  beforeDestroy() {
    this.destroyContainer();
  },

  methods: {
    /**
     * Init container
     */
    initContainer() {
      mutations.createContainer(this.containerId);
      mutations.setContainerBlocks(this.containerId, normalizeBlocksObject(this.blocks));
      mutations.setContainerSchema(this.containerId, this.value);

      this.$watch('containerSchema', {
        handler(newVal) {
          /**
           * Change event
           */
          this.$emit('change', newVal);
        },
        deep: true
      });

      this.$watch('value', {
        handler(newVal) {
          if (newVal && !isEqual(newVal, this.containerSchema)) {
            mutations.setContainerSchema(this.containerId, newVal);
          }
        },
        deep: true
      });

      this.$watch('blocks', {
        handler(newVal) {
          if (newVal && !isEqual(newVal, this.containerBlocks)) {
            mutations.setContainerBlocks(this.containerId, newVal);
          }
        },
        deep: true
      });

      window.addEventListener('keydown', this.deleteKeyListener);
      this.ready = true;
    },

    /**
     * Destroy container
     */
    destroyContainer() {
      mutations.removeContainer(this.containerId);

      window.removeEventListener('keydown', this.deleteKeyListener);
    },

    /**
     * Delete key listener
     * @param {KeyboardEvent} e
     */
    deleteKeyListener(e) {
      if (
        ['Backspace', 'Delete'].includes(e.key)
        && this.containerActiveNode
        && e.target.nodeName !== 'INPUT'
      ) {
        mutations.removeContainerSchemaNode(this.containerId, this.containerActiveNode);
      }
    }
  },

  render() {
    return (
      <div>
        {this.ready ? this.$slots.default : null}
      </div>
    );
  }
};
