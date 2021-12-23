import { VexImageInput } from '@deip/vuetify-extended';

import { AttributeSetMixin } from '../../mixins';

export const AttributeImageSet = {
  name: 'AttributeImageSet',

  mixins: [AttributeSetMixin],

  methods: {
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
};
