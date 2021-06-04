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

import { ATTR_TYPES } from '@deip/attributes-service';
import { ATTR_TYPES_SET_RULES, ATTR_TYPES_SET_SCHEMAS } from '../constants';

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
    genAttribute(additionalProps) {
      return this.$createElement(SchemaRenderer, {
        props: {
          components,
          schema: this.normalisedSchema,
          schemaData: {
            ...this.schemaData,
            attributeInfo: this.attributeInfo,
            attributeValue: isFile(this.value) ? this.value.name : this.value,
            proxyProps: Object.keys(components)
              .reduce((acc, key) => ({ ...acc, ...{ [key]: this.proxyProps[key] || {} } }), {})
          },
          value: this.value || this.attributeInfo.defaultValue,
          disabled: this.attributeInfo.isEditable,
          ...additionalProps
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
          rules: ATTR_TYPES_SET_RULES[this.attributeInfo.type] || 'required'
        },
        scopedSlots: {
          default: ({ errors }) => this.genAttribute({
            errorMessages: errors
          })
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
