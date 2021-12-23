import { VexPlacesAutocomplete } from '@deip/vuetify-extended';

import { AttributeSetMixin } from '../../mixins';

export const AttributeLocationSet = {
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
};
