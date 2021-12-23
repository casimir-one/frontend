import { VexImageInput } from '@deip/vuetify-extended';

import { AttributeSetMixin } from '../../mixins';

const avatarMask = `
<svg
  viewBox="0 0 320 320"
  fill="rgba(0,0,0,.5)"
>
  <path
    fill-rule="evenodd"
    clip-rule="evenodd"
    d="M160 0H0V160V320H160H320V160V0H160ZM160 0C248.366 0 320 71.6344 320 160C320 248.366 248.366 320 160 320C71.6344 320 0 248.366 0 160C0 71.6344 71.6344 0 160 0Z"
  >
</svg>
`;

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
          mask={avatarMask}
          noFlip
          noRotate
          initialImage={this.schemaData.getAttributeFileSrc(this.attributeId)}
          errorMessages={errors}
        />
      );
    }
  }
};
