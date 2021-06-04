import { ATTR_TYPES } from '@deip/attributes-service';

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

export const ATTR_TYPES_SET_SCHEMAS = {
  [ATTR_TYPES.TEXT]: {
    is: 'v-text-field',
    data: {
      props: {
        label: '{{attributeInfo.title}}'
      }
    },
    model: true
  },
  [ATTR_TYPES.TEXTAREA]: {
    is: 'v-textarea',
    data: {
      props: {
        label: '{{attributeInfo.title}}',
        rows: 3,
        autoGrow: true
      }
    },
    model: true
  },

  [ATTR_TYPES.IMAGE]: {
    is: 'vex-image-input',
    data: {
      props: {
        label: '{{attributeInfo.title}}',
        aspectRatio: '{{proxyProps.VexImageInput.aspectRatio}}'
      }
    },
    model: true
  },

  [ATTR_TYPES.AVATAR]: {
    is: 'vex-image-input',
    data: {
      props: {
        label: '{{attributeInfo.title}}',
        aspectRatio: 1,
        mask: avatarMask,
        noFlip: true,
        noRotate: true,
        initialImage: '@getAttributeFileSrc("{{attributeInfo._id}}", "{{attributeValue}}")'
      }
    },
    model: {
      event: 'change',
      path: false
    }
  },

  [ATTR_TYPES.LOCATION]: {
    is: 'vex-places-autocomplete',
    data: {
      props: {
        label: '{{attributeInfo.title}}'
      }
    },
    model: {
      event: 'change',
      path: false
    }
  }
};
