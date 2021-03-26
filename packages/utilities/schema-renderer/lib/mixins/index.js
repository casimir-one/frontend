import { factory as ProxyableFactory } from 'vuetify/lib/mixins/proxyable';

export const abstractNode = {
  components: {
    // NOTE: Fix for recursive call
    SchemaComposerNodes: () => import('../components/SchemaComposer/SchemaComposerNodes')
  },

  mixins: [ProxyableFactory('node')],

  data() {
    return {
      clicked: false
    }
  },

  methods: {
    onClickNode(e) {
      this.clicked = true;
      this.$emit('click-node', e);
    },

    onClickOutside() {
      this.clicked = false;
    }
  }
};
