import { isEqual } from '@deip/toolbox/lodash';

import {
  compactAttributes,
  expandAttributes
} from '@deip/platform-fns';

import { defineComponent } from '@deip/platform-util';
import { formFactory } from '@deip/platform-components';

const attributedFormFactory = (
  prop = 'value',
  event = 'input',
) => (defineComponent({
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
        return expandAttributes(this.lazyFormData);
      },
      set(val) {
        if (isEqual(val, this.lazyFormData)) return;

        this.lazyFormData = compactAttributes(val);
        this.$emit(event, val);
      }
    }
  }
}));

const AttributedForm = attributedFormFactory();

export {
  AttributedForm,
  attributedFormFactory
};
