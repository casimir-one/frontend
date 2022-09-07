import { VlsParser } from '@casimir.one/vue-layout-schema';
import { defineComponent } from '@casimir.one/platform-util';
import { defaultLayoutComponents } from '../../helpers/defaultLayoutsComponents';

/**
  * Component for rendering layouts
  */
export const LayoutRenderer = defineComponent({
  name: 'LayoutRenderer',

  components: {
    ...defaultLayoutComponents
  },

  mixins: [VlsParser],

  beforeCreate() {
    this.$options.methods.registerComponents
      .call(this, this.$store.getters['layoutsRegistry/components']);
  }
});
