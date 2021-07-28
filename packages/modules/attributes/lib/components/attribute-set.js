import { SchemaRenderer } from '@deip/schema-renderer';
import { isEqual, merge } from 'lodash/fp';
import { wrapInArray } from '@deip/toolbox';
import { ValidationProvider } from '@deip/validation-plugin';

import {
  ATTR_TYPES,
  ATTR_TYPES_SET_RULES
} from '@deip/constants';

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

import { defineComponent } from '@deip/platform-util';
import { abstractAttributeFactory } from '../mixins/attribute';
import { ATTR_TYPES_SET_SCHEMAS } from '../schemas';

const AttributeSet = defineComponent({
  name: 'AttributeSet',

  mixins: [
    abstractAttributeFactory(
      ATTR_TYPES_SET_SCHEMAS,
      {
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
      }
    )
  ],

  model: {
    prop: 'value',
    event: 'input'
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
        return wrapInArray(merge(this.internalSchema, optionsPropsData));
      }

      return wrapInArray(this.internalSchema);
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
      const schemaData = merge(
        this.internalSchemaData,
        {
          attribute: {
            errors
          }
        }
      );

      return (
        <SchemaRenderer
          schema={this.normalisedSchema}
          schemaData={schemaData}
          components={this.internalComponents}
          value={this.value || this.attributeInfo.defaultValue}
          onInput={(val) => {
            this.internalValue = val;
          }}
        />
      );
    },

    // genAttribute(errors = []) {
    //   return this.$createElement(SchemaRenderer, {
    //     props: {
    //       value: this.value || this.attributeInfo.defaultValue,
    //       disabled: this.attributeInfo.isEditable
    //     },
    //     attrs: this.$attrs,
    //     on: {
    //       input: (val) => {
    //         this.internalValue = val;
    //       }
    //     }
    //   });
    // },

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
});

export default AttributeSet;
export { AttributeSet };
