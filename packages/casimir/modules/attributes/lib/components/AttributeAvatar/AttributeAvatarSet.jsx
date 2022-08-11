import { VexImageInput } from '@casimir/vuetify-extended';

import { defineComponent } from '@casimir/platform-util';
import { AttributeSetMixin } from '../../mixins';

/**
 * Component for editable attribute avatar
 */
export default defineComponent({
  name: 'AttributeAvatarSet',

  mixins: [AttributeSetMixin],

  methods: {
    /**
     * Generate editable attribute avatar
     *
     * @param {Array} errors
     */
    genAttribute(errors) {
      return (
        <VexImageInput
          vModel={this.internalValue}
          label={this.attributeInfo.title}
          aspectRatio={1}
          round
          noFlip
          noRotate
          initialImage={this.schemaData.getAttributeFileSrc(this.attributeId)}
          errorMessages={errors}
        />
      );
    }
  }
});
