import { VexImageInput } from '@deip/vuetify-extended';

import { defineComponent } from '@deip/platform-util';
import { AttributeSetMixin } from '../../mixins';

/**
 * Component for changing image attribute
 */
export const AttributeImageSet = defineComponent({
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
          aspectRatio={this?.proxyProps?.VexImageInput?.aspectRatio}
          initialImage={this.schemaData.getAttributeFileSrc(this.attributeId)}
          errorMessages={errors}
        />
      );
    }
  }
});
