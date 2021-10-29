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
    schema() { return getters.schema(this.containerId); },
    activeNode() { return getters.activeNode(this.containerId); }
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

      if (this.value && this.value.length) {
        mutations.updateContainerSchema(this.containerId, this.value);
      }

      this.$watch('schema', {
        handler(newVal, oldVal) {
          if (newVal && !isEqual(newVal, oldVal)) {
            this.$emit('change', newVal);
          }
        },
        deep: true
      });

      this.$watch('value', {
        handler(newVal) {
          if (newVal && !isEqual(newVal, this.schema)) {
            mutations.updateContainerSchema(this.containerId, newVal);
          }
        },
        deep: true
      });

      window.addEventListener('keydown', this.deleteKeyListener);
    },

    destroyContainer() {
      mutations.removeContainer(this.containerId);

      window.removeEventListener('keydown', this.deleteKeyListener);
    },

    deleteKeyListener(e) {
      if (
        ['Backspace', 'Delete'].includes(e.key)
        && this.activeNode
        && e.target.nodeName !== 'INPUT'
      ) {
        mutations.removeContainerSchemaNode(this.containerId, this.activeNode);
      }
    }
  },

  render() {
    return (
      <div>
        {this.$slots.default}
      </div>
    );
  },

  provide() {
    return {
      containerId: this.containerId
    };
  }
};
