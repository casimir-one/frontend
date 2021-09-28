import { objectPath, deepFind, deepFindParentByValue } from '@deip/toolbox';
import { isEqual } from '@deip/toolbox/lodash';
// eslint-disable-next-line import/extensions,import/no-unresolved
import { factory as ProxyableFactory } from 'vuetify/lib/mixins/proxyable';
import { normalizeBlocksObject } from '../utils/helpers';
import { getters, mutations } from '../store';

export const SchemeView = {
  name: 'SchemeView',

  mixins: [ProxyableFactory('schema', 'input')],

  props: {
    blocks: {
      type: Array,
      default: () => []
    },
    watchDeleteKey: {
      type: Boolean,
      default: false
    }
  },

  data(vm) {
    return {
      lazySchema: vm.schema || []
    };
  },

  computed: {
    ...getters,

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
    activeNode(val, oldVal) {
      if (val !== oldVal) {
        this.selectNode(val);
        this.$emit('select-node', val);
      }
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

    this.setActiveNode(null);
  },

  methods: {
    ...mutations,

    selectNode() {},

    getNodeInfo(id) {
      return objectPath.get(
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
      const { path } = deepFindParentByValue(this.internalSchema, id, true);
      this.setActiveNode(null);
      objectPath.del(this.internalSchema, path);
    }
  }
};
