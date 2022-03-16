import { VlsParser } from '@deip/vue-layout-schema';
import { defineComponent } from '@deip/platform-util';
import { defaultLayoutComponents } from '../../helpers/defaultLayoutsComponents';

/**
  * Component for rendering layouts
  * @requires defaultLayoutComponents
  */
export const LayoutRenderer = defineComponent({
  name: 'LayoutRenderer',

  components: {
    ...defaultLayoutComponents
  },

  mixins: [VlsParser],

  beforeCreate() {
    this.$options.methods.registerComponents.call(this, this.$store.getters['layoutsRegistry/components']);
  }
});
