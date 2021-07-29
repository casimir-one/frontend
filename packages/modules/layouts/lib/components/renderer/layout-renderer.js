import { SchemaRenderer } from '@deip/schema-renderer';
import { defineComponent } from '@deip/platform-util';
import { defaultLayoutComponents } from '../../default-layouts-components';

export const LayoutRenderer = defineComponent({
  name: 'LayoutRenderer',
  components: defaultLayoutComponents,
  mixins: [SchemaRenderer]
});
