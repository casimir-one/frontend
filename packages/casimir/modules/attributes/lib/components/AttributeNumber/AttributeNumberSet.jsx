import {
  VTextField
// eslint-disable-next-line import/extensions,import/no-unresolved
} from 'vuetify/lib/components';

import { defineComponent } from '@deip/platform-util';
import { AttributeSetMixin } from '../../mixins';

/**
 * Component for changing number attribute
 */
export default defineComponent({
  name: 'AttributeNumberSet',

  mixins: [AttributeSetMixin],

  methods: {
    /**
     * Generate changing number attribute
     *
     * @param {Array} errors
     */
    genAttribute(errors) {
      return (
        <VTextField
          type="number"
          vModel={this.internalValue}
          label={this.attributeInfo.title}
          errorMessages={errors}
        />
      );
    }
  }
});
