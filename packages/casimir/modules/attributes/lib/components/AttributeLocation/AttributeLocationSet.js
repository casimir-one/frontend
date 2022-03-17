import { VexPlacesAutocomplete } from '@deip/vuetify-extended';

import { defineComponent } from '@deip/platform-util';
import { AttributeSetMixin } from '../../mixins';

/**
 * Component for changing location attribute
 */
export const AttributeLocationSet = defineComponent({
  name: 'AttributeLocationSet',

  mixins: [AttributeSetMixin],

  methods: {
    /**
     * Generate changing location attribute
     *
     * @param {Array} errors
     */
    genAttribute(errors) {
      return (
        <VexPlacesAutocomplete
          vModel={this.internalValue}
          label={this.attributeInfo.title}
          errorMessages={errors}
        />
      );
    }
  }
});
