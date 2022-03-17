import { VexDateInput } from '@deip/vuetify-extended';

import { defineComponent } from '@deip/platform-util';
import { AttributeSetMixin } from '../../mixins';

/**
 * Component for changing date attribute
 */
export const AttributeDateSet = defineComponent({
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
