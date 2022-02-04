import { VexDateTimeInput } from '@deip/vuetify-extended';

import { defineComponent } from '@deip/platform-util';
import { AttributeSetMixin } from '../../mixins';

export const AttributeDateTimeSet = defineComponent({
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
});
