import { VexDateTimeInput } from '@deip/vuetify-extended';

import { AttributeSetMixin } from '../../mixins';

export const AttributeDateTimeSet = {
  name: 'AttributeDateTimeSet',

  mixins: [AttributeSetMixin],

  methods: {
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
};
