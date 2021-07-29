import { defineComponent } from '@deip/platform-util';
import { defaultLayoutComponents } from '../default-layouts-components';

const attributedDetailsFactory = (
  prop = 'value',
) => (defineComponent({
  name: 'AttributedDetails',

  props: {
    [prop]: {
      type: Object,
      default: () => ({})
    },

    schema: {
      type: Array,
      default: () => []
    },
    components: {
      type: Object,
      default: () => ({})
    }
  },

  computed: {
    internalSchema() {
      return this.schema.length ? this.schema : [];
    },

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
