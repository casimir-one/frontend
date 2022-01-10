import { VexImageInput } from '@deip/vuetify-extended';

import { AttributeSetMixin } from '../../mixins';

export const AttributeAvatarSet = {
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
};
