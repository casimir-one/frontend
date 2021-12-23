import {
  VTextField
// eslint-disable-next-line import/extensions,import/no-unresolved
} from 'vuetify/lib/components';

import { AttributeSetMixin } from '../../mixins';

export const AttributeVideoUrlSet = {
  name: 'AttributeVideoUrlSet',

  mixins: [AttributeSetMixin],

  methods: {
    genAttribute(errors) {
      return (
        <VTextField
          prepend-inner-icon="mdi-video-outline"
          vModel={this.internalValue}
          label={this.attributeInfo.title}
          errorMessages={errors}
        />
      );
    }
  }
};
