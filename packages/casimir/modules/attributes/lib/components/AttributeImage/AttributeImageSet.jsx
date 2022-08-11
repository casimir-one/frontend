import { VexImageInput } from '@casimir/vuetify-extended';

import { defineComponent } from '@casimir/platform-util';
import { AttributeSetMixin } from '../../mixins';

/**
 * Component for changing image attribute
 */
export default defineComponent({
  name: 'AttributeImageSet',

  mixins: [AttributeSetMixin],

  methods: {
    /**
     * Generate changing image attribute
     *
     * @param {Array} errors
     */
    genAttribute(errors) {
      return (
        <VexImageInput
          vModel={this.internalValue}
          label={this.attributeInfo.title}
          { ...{ props: this?.proxyProps?.VexImageInput || {} }}
          initialImage={this.schemaData.getAttributeFileSrc(this.attributeId)}
          errorMessages={errors}
        />
      );
    }
  }
});
