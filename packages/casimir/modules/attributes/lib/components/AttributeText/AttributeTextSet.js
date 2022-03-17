import {
  VTextField
// eslint-disable-next-line import/extensions,import/no-unresolved
} from 'vuetify/lib/components';

import { defineComponent } from '@deip/platform-util';
import { AttributeSetMixin } from '../../mixins';

/**
 * Component for changing text field attribute
 */
export const AttributeTextSet = defineComponent({
  name: 'AttributeTextSet',

  mixins: [AttributeSetMixin],

  methods: {
    /**
     * Generate changing text field
     *
     * @param {Array} errors
     */
    genAttribute(errors) {
      return (
        <VTextField
          vModel={this.internalValue}
          label={this.attributeInfo.title}
          errorMessages={errors}
        />
      );
    }
  }
});
