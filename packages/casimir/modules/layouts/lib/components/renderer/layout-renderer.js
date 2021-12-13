import { VlsParser } from '@deip/vue-layout-schema';
import { defineComponent } from '@deip/platform-util';
import { defaultLayoutComponents } from '../../default-layouts-components';

import { LayoutsRegistry } from '../../registry';

const layoutsRegistry = LayoutsRegistry.getInstance();

export const LayoutRenderer = defineComponent({
  name: 'LayoutRenderer',

  components: {
    ...defaultLayoutComponents,
    ...layoutsRegistry.getComponents()
  },

  mixins: [VlsParser],

  beforeCreate() {
    this.$options.methods.registerComponents.call(this, layoutsRegistry.getComponents());
  }

});
