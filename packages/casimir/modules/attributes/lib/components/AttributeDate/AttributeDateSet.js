import { VexDateInput } from '@deip/vuetify-extended';

import { AttributeSetMixin } from '../../mixins';

export const AttributeDateSet = {
  name: 'AttributeDateSet',

  mixins: [AttributeSetMixin],

  methods: {
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
};
