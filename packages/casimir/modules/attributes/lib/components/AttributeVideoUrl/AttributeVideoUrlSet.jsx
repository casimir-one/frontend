import {
  VTextField
// eslint-disable-next-line import/extensions,import/no-unresolved
} from 'vuetify/lib/components';

import { defineComponent } from '@casimir/platform-util';
import { AttributeSetMixin } from '../../mixins';

/**
 * Component for changing video url attribute
 */
export default defineComponent({
  name: 'AttributeVideoUrlSet',

  mixins: [AttributeSetMixin],

  methods: {
    /**
     * Generate changing video url attribute
     *
     * @param {Array} errors
     */
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
