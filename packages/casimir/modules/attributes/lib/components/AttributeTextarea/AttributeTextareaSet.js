import {
  VTextarea
// eslint-disable-next-line import/extensions,import/no-unresolved
} from 'vuetify/lib/components';

import { AttributeSetMixin } from '../../mixins';

export const AttributeTextareaSet = {
  name: 'AttributeTextareaSet',

  mixins: [AttributeSetMixin],

  methods: {
    genAttribute(errors) {
      return (
        <VTextarea
          vModel={this.internalValue}
          label={this.attributeInfo.title}
          errorMessages={errors}
          rows={10}
          noResize={false}
        />
      );
    }
  }
};
