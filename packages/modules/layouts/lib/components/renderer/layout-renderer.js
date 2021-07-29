import { SchemaRenderer } from '@deip/schema-renderer';
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

  mixins: [SchemaRenderer],

  beforeCreate() {
    this.$options.methods.registerComponents.call(this, layoutsRegistry.getComponents());
  }

});
