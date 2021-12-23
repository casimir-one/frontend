import {
  VSelect
// eslint-disable-next-line import/extensions,import/no-unresolved
} from 'vuetify/lib/components';

import { AttributeSetMixin } from '../../mixins';

export const AttributeSelectSet = {
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
};
