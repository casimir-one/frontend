import * as components from 'vuetify/lib/components';
import { SchemaRenderer } from './SchemaRenderer';

export const SchemaRendererExtended = {
  name: 'SchemaRendererExtended',
  components: {
    ...components
  },
  mixins: [SchemaRenderer]
};
