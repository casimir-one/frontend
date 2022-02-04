import { VexPlacesAutocomplete } from '@deip/vuetify-extended';

import { defineComponent } from '@deip/platform-util';
import { AttributeSetMixin } from '../../mixins';

export const AttributeLocationSet = defineComponent({
  name: 'AttributeLocationSet',

  mixins: [AttributeSetMixin],

  methods: {
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
