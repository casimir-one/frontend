import { VexDateTimeInput } from '@deip/vuetify-extended';

import { defineComponent } from '@deip/platform-util';
import { AttributeSetMixin } from '../../mixins';

/**
 * Component for changing date time attribute
 */
export const AttributeDateTimeSet = defineComponent({
  name: 'AttributeDateTimeSet',

  mixins: [AttributeSetMixin],

  methods: {
    /**
     * Generate changing date time attribute
     *
     * @param {Array} errors
     */
    genAttribute(errors) {
      return (
        <VexDateTimeInput
          vModel={this.internalValue}
          label={this.attributeInfo.title}
          errorMessages={errors}
        />

      );
    }
  }
});
