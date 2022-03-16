import { defineComponent } from '@deip/platform-util';
import { defaultLayoutComponents } from './defaultLayoutsComponents';

const attributedDetailsFactory = (
  prop = 'value',
) => (defineComponent({
  name: 'AttributedDetails',

  props: {
    [prop]: {
      type: Object,
      default: () => ({})
    },
    /**
     * Schema
     */
    schema: {
      type: Array,
      default: () => []
    },
    /**
     * Schema data
     */
    schemaData: {
      type: Object,
      default: () => {}
    },
    /**
     * Layout components
     */
    components: {
      type: Object,
      default: () => ({})
    }
  },

  computed: {
    /**
      * Get computed internal schema
      */
    internalSchema() {
      return this.schema.length ? this.schema : [];
    },
    /**
      * Get computed internal layout components
      */
    internalComponents() {
      return {
        ...this.components,
        ...defaultLayoutComponents
      };
    }
  }
}));

const AttributedDetails = attributedDetailsFactory();

export {
  AttributedDetails,
  attributedDetailsFactory
};
