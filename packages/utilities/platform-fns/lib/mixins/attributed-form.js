import { isEqual } from '@deip/toolbox/lodash';

import {
  compactAttributes,
  expandAttributes
} from '../helpers';

import { formFactory } from './form';

const attributedFormFactory = (
  prop = 'value',
  event = 'input',
) => ({
  name: 'AttributedForm',

  mixins: [formFactory(prop, event)],

  props: {
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
    formData: {
      get() {
        return {
          ...this.lazyFormData,
          ...{
            attributes: expandAttributes(this.lazyFormData.attributes)
          }
        };
      },
      set(val) {
        if (isEqual(val, this.lazyFormData)) return;

        this.lazyFormData = {
          ...val,
          ...{
            attributes: compactAttributes(val.attributes)
          }
        };
        this.$emit(event, val);
      }
    }
  }
});

const AttributedForm = attributedFormFactory();

export {
  AttributedForm,
  attributedFormFactory
};
