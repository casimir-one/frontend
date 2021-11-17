import { uuidv4 } from '@deip/toolbox';
import { isEqual } from '@deip/toolbox/lodash';

import { mutations, getters } from '../../store';
import { normalizeBlocksObject } from '../../utils/helpers';

export const VlsBuilderContainer = {
  name: 'VlsBuilderContainer',

  model: {
    prop: 'value',
    event: 'change'
  },

  props: {
    blocks: {
      type: Array,
      default: () => []
    },

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
    containerBlocks() { return getters.containerBlocks(this.containerId); },
    containerSchema() { return getters.containerSchema(this.containerId); },
    containerActiveNode() { return getters.containerActiveNode(this.containerId); }
  },

  created() {
    this.initContainer();
  },

  beforeDestroy() {
    this.destroyContainer();
  },

  methods: {
    initContainer() {
      mutations.createContainer(this.containerId);
      mutations.setContainerBlocks(this.containerId, normalizeBlocksObject(this.blocks));
      mutations.setContainerSchema(this.containerId, this.value);

      this.$watch('containerSchema', {
        handler(newVal, oldVal) {
          if (newVal && !isEqual(newVal, oldVal)) {
            this.$emit('change', newVal);
          }
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

      this.$watch('containerBlocks', {
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

    destroyContainer() {
      mutations.removeContainer(this.containerId);

      window.removeEventListener('keydown', this.deleteKeyListener);
    },

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
  },

  provide() {
    return {
      containerId: this.containerId
    };
  }
};
