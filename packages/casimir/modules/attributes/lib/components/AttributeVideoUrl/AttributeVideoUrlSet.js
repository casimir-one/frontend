import {
  VTextField
// eslint-disable-next-line import/extensions,import/no-unresolved
} from 'vuetify/lib/components';

import { defineComponent } from '@deip/platform-util';
import { AttributeSetMixin } from '../../mixins';

export const AttributeVideoUrlSet = defineComponent({
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
});
