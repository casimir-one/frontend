import { VexImageInput } from '@deip/vuetify-extended';

import { defineComponent } from '@deip/platform-util';
import { AttributeSetMixin } from '../../mixins';

export const AttributeAvatarSet = defineComponent({
  name: 'AttributeAvatarSet',

  mixins: [AttributeSetMixin],

  methods: {
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
