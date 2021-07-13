import { SchemaRenderer } from '@deip/schema-renderer';
import { isEqual, merge } from 'lodash/fp';
import { isFile, wrapInArray } from '@deip/toolbox';
import { ValidationProvider } from '@deip/validation-plugin';

import {
  VTextField,
  VTextarea,
  VSelect,
  VSwitch,
  VCheckbox
// eslint-disable-next-line import/extensions,import/no-unresolved
} from 'vuetify/lib/components';

import {
  VexImageInput,
  VexDateInput,
  VexTimeInput,
  VexDateTimeInput,
  VexFileInput,
  VexFileInputExtended,
  VexPlacesAutocomplete
} from '@deip/vuetify-extended';

import {
  ATTR_TYPES,
  ATTR_TYPES_SET_RULES
} from '@deip/constants';

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

const ATTR_TYPES_SET_SCHEMAS = {
  [ATTR_TYPES.TEXT]: {
    is: 'v-text-field',
    data: {
      props: {
        label: '{{attribute.info.title}}',
        errorMessages: '{{attribute.errors}}'
      }
    },
    model: true
  },
  [ATTR_TYPES.TEXTAREA]: {
    is: 'v-textarea',
    data: {
      props: {
        label: '{{attribute.info.title}}',
        rows: 3,
        autoGrow: true,
        errorMessages: '{{attribute.errors}}'
      }
    },
    model: true
  },

  [ATTR_TYPES.IMAGE]: {
    is: 'vex-image-input',
    data: {
      props: {
        label: '{{attribute.info.title}}',
        aspectRatio: '{{attribute.props.VexImageInput.aspectRatio}}',
        initialImage: '@getAttributeFileSrc("{{attribute.info._id}}", "{{attribute.value}}")',
        errorMessages: '{{attribute.errors}}'
      }
    },
    model: {
      event: 'change',
      path: false
    }
  },

  [ATTR_TYPES.AVATAR]: {
    is: 'vex-image-input',
    data: {
      props: {
        label: '{{attribute.info.title}}',
        aspectRatio: 1,
        mask: avatarMask,
        noFlip: true,
        noRotate: true,
        initialImage: '@getAttributeFileSrc("{{attribute.info._id}}", "{{attribute.value}}")',
        errorMessages: '{{attribute.errors}}'
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
        label: '{{attribute.info.title}}',
        errorMessages: '{{attribute.errors}}'
      }
    },
    model: {
      event: 'change',
      path: false
    }
  }
};

const components = {
  VTextField,
  VTextarea,
  VSelect,
  VSwitch,
  VCheckbox,

  VexImageInput,
  VexDateInput,
  VexTimeInput,
  VexDateTimeInput,
  VexFileInput,
  VexFileInputExtended,
  VexPlacesAutocomplete
};

const AttributeSet = {
  name: 'AttributeSet',

  model: {
    prop: 'value',
    event: 'input'
  },

  props: {
    attributeId: {
      type: String,
      required: true
    },

    value: {
      type: [String, Number, Array, Object, Boolean, File],
      default: null
    },

    schemaData: {
      type: Object,
      default: () => ({})
    },

    proxyProps: {
      type: Object,
      default: () => ({})
    }
  },

  data() {
    return {
      lazyValue: ''
    };
  },

  computed: {
    internalValue: {
      get() {
        return this.lazyValue;
      },
      set(val) {
        if (isEqual(val, this.lazyValue)) return;
        this.lazyValue = val;
        this.$emit('input', val);
      }
    },

    attributeInfo() {
      return this.$store.getters['attributes/one'](this.attributeId);
    },

    renderSchema() {
      return this.attributeInfo?.schemas?.set
        || ATTR_TYPES_SET_SCHEMAS[this.attributeInfo.type]
        || { is: 'div', text: `${this.attributeInfo.title} need [SET] schema` };
    },

    normalisedSchema() {
      const optionsPropsData = this.attributeInfo.valueOptions.length
        ? {
          data: {
            props: {
              items: this.attributeInfo.valueOptions,
              itemText: 'title',
              itemValue: 'value'
            }
          }
        }
        : {};

      if (this.attributeInfo.type === ATTR_TYPES.SELECT) {
        return wrapInArray(merge(this.renderSchema, optionsPropsData));
      }

      return wrapInArray(this.renderSchema);
    }
  },

  watch: {
    value: {
      handler(val) {
        if (val && !isEqual(this.value, this.internalValue)) this.internalValue = val;
      },
      immediate: true,
      deep: true
    }
  },

  methods: {
    genAttribute(errors = []) {
      return this.$createElement(SchemaRenderer, {
        props: {
          components,
          schema: this.normalisedSchema,
          schemaData: {
            ...this.schemaData,
            attribute: {
              info: this.attributeInfo,
              value: isFile(this.value) ? this.value.name : this.value,
              props: Object.keys(components)
                .reduce((acc, key) => ({ ...acc, ...{ [key]: this.proxyProps[key] || {} } }), {}),
              errors
            },
            attributeInfo: this.attributeInfo,
            attributeValue: isFile(this.value) ? this.value.name : this.value,
            errors,
            proxyProps: Object.keys(components)
              .reduce((acc, key) => ({ ...acc, ...{ [key]: this.proxyProps[key] || {} } }), {})
          },
          value: this.value || this.attributeInfo.defaultValue,
          disabled: this.attributeInfo.isEditable
        },
        attrs: this.$attrs,
        on: {
          input: (val) => {
            this.internalValue = val;
          }
        }
      });
    },

    genRequiredAttribute() {
      return this.$createElement(ValidationProvider, {
        props: {
          name: this.attributeInfo.title,
          rules: ATTR_TYPES_SET_RULES[this.attributeInfo.type] || 'required'
        },
        scopedSlots: {
          default: ({ errors }) => this.genAttribute(errors)
        }
      });
    }
  },

  render() {
    if (this.attributeInfo) {
      return this.attributeInfo.isRequired ? this.genRequiredAttribute() : this.genAttribute();
    }
    return false;
  }
};

export default AttributeSet;
export { AttributeSet };
