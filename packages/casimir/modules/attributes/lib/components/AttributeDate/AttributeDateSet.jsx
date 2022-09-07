import { VexDateInput } from '@casimir.one/vuetify-extended';

import { defineComponent } from '@casimir.one/platform-util';
import { AttributeSetMixin } from '../../mixins';

/**
 * Component for changing date attribute
 */
export default defineComponent({
  name: 'AttributeDateSet',

  mixins: [AttributeSetMixin],

  methods: {
    /**
     * Generate changing date attribute
     *
     * @param {Array} errors
     */
    genAttribute(errors) {
      return (
        <VexDateInput
          vModel={this.internalValue}
          label={this.attributeInfo.title}
          errorMessages={errors}
        />
      );
    }
  }
});
