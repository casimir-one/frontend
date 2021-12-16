import { VlsParser } from '@deip/vue-layout-schema';
import { isEqual, merge, cloneDeep } from '@deip/toolbox/lodash';
import { wrapInArray, objectPath, isArray } from '@deip/toolbox';
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
  VCheckbox,
  VBtn,
  VIcon,

  VCol,
  VRow
// eslint-disable-next-line import/extensions,import/no-unresolved
} from 'vuetify/lib/components';

import {
  VexImageInput,
  VexDateInput,
  VexTimeInput,
  VexDateTimeInput,
  VexFileInput,
  VexFileInputExtended,
  VexPlacesAutocomplete,
  VexRichedit
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

        VCol,
        VRow,

        VexImageInput,
        VexDateInput,
        VexTimeInput,
        VexDateTimeInput,
        VexFileInput,
        VexFileInputExtended,
        VexPlacesAutocomplete,
        VexRichedit
      },
      'set'
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
    genStandardAttribute(errors, subPath, defaultValue) {
      const schemaData = merge(
        this.internalSchemaData,
        { attribute: { errors } }
      );

      const attributeValue = this.value || this.attributeInfo.defaultValue || defaultValue;
      const providedValue = subPath ? objectPath.get(attributeValue, subPath) : attributeValue;

      return (
        <VlsParser
          schema={this.normalisedSchema}
          schemaData={schemaData}
          components={this.internalComponents}
          value={providedValue}
          onInput={(val) => {
            if (subPath) {
              const clone = cloneDeep(this.internalValue);
              objectPath.set(clone, subPath, val);
              this.internalValue = clone;
            } else {
              this.internalValue = val;
            }
          }}
        />
      );
    },

    genAttribute(errors = []) {
      if (this.attributeInfo.isMultiple) {
        return this.genMultipleAttribute(errors);
      }

      return this.genStandardAttribute(errors);
    },

    genMultipleAttribute(errors = []) {
      const addRowBtn = (
        <VBtn
          text
          small
          color="primary"
          onClick={() => this.internalValue.push(undefined)}
        >
          Add item
        </VBtn>
      );

      if (!isArray(this.internalValue)) {
        this.internalValue = [];
      }

      const attributeRows = this.internalValue.map((_, index) => {
        const delHandler = () => {
          this.internalValue.splice(index, 1);
        };

        const delButton = () => (
          <VBtn icon small onClick={delHandler}>
            <VIcon>mdi-close</VIcon>
          </VBtn>
        );

        return (
          <VRow noGutters align="start">
            <VCol class="py-4">
              {this.genStandardAttribute(errors, [index], [])}
            </VCol>
            <VCol cols="auto" class="px-3 py-5">
              {delButton()}
            </VCol>
          </VRow>
        );
      });

      return (
        <div>
          {attributeRows}
          {addRowBtn}
        </div>
      );
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
});

export default AttributeSet;
export { AttributeSet };
