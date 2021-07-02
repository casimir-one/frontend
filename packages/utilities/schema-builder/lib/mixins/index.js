import { dotProp, deepFind } from '@deip/toolbox';
import { isEqual } from '@deip/toolbox/lodash';
// eslint-disable-next-line import/extensions,import/no-unresolved
import { factory as ProxyableFactory } from 'vuetify/lib/mixins/proxyable';
import { normalizeBlocksObject } from '../utils/helpers';

export const SchemeView = {
  name: 'SchemeView',

  mixins: [ProxyableFactory('schema')],

  props: {
    blocks: {
      type: Array,
      default: () => []
    },
    activeNode: {
      type: String,
      default: null
    },
    watchDeleteKey: {
      type: Boolean,
      default: false
    }
  },

  data(vm) {
    return {
      lazySchema: vm.schema || [],
      lazyActiveNode: vm.activeNode || null
    };
  },

  computed: {
    normalizedBlocks() {
      return normalizeBlocksObject(this.blocks);
    },

    internalSchema: {
      get() {
        return this.lazySchema;
      },
      set(val) {
        if (isEqual(val, this.lazySchema)) return;
        this.lazySchema = val;
        this.$emit('input', val);
      }
    }
  },

  watch: {
    activeNode(val) {
      this.selectNode(val);
    },

    schema: {
      handler(val) {
        if (val && !isEqual(this.schema, this.internalSchema)) this.internalSchema = val;
      },
      deep: true
    }
  },

  created() {
    if (this.watchDeleteKey) {
      window.addEventListener('keydown', this.deleteListener);
    }
  },

  beforeDestroy() {
    if (this.watchDeleteKey) {
      window.removeEventListener('keydown', this.deleteListener);
    }
  },

  methods: {
    selectNode(val) {
      this.$emit('select-node', val);
    },

    getNodeInfo(id) {
      return dotProp.get(
        this.normalizedBlocks,
        deepFind(this.normalizedBlocks, id).slice(0, -1).join('.')
      );
    },

    deleteListener(e) {
      if (
        ['Backspace', 'Delete'].includes(e.key)
        && this.activeNode
        && e.target.nodeName !== 'INPUT'
      ) {
        this.removeNode(this.activeNode);
      }
    },

    removeNode(id) {
      const targetPath = deepFind(this.internalSchema, id).slice(0, -1).join('.');

      this.selectNode(null);
      dotProp.delete(this.internalSchema, targetPath);
    }
  }
};
