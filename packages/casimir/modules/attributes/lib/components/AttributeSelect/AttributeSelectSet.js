import {
  VSelect
// eslint-disable-next-line import/extensions,import/no-unresolved
} from 'vuetify/lib/components';

import { defineComponent } from '@deip/platform-util';
import { AttributeSetMixin } from '../../mixins';

export const AttributeSelectSet = defineComponent({
  name: 'AttributeSelectSet',

  mixins: [AttributeSetMixin],

  methods: {
    genAttribute(errors) {
      return (
        <VSelect
          vModel={this.internalValue}
          label={this.attributeInfo.title}
          items={this.attributeInfo.valueOptions}
          item-text="title"
          item-value="value"
          multiple={!!this.attributeInfo.isMultiple}
          errorMessages={errors}
        />
      );
    }
  }
});
