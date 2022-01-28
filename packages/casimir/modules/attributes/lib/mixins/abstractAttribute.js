import {
  collectionList,
  hasOwnProperty,
  isFile,
  wrapInArray
} from '@deip/toolbox';
import { isEqual, cloneDeep } from '@deip/toolbox/lodash';
import { ValidationProvider } from '@deip/validation-plugin';
import { VeStack } from '@deip/vue-elements';

/**
 * @param {string} fnName
 * @param {string} label
 * @return {string}
 */
const slotPlaceholder = (fnName, label) => `
Need specify ${fnName} method for ${label} attribute
`;

export const AttributeMixin = {
  name: 'AbstractAttributeMixin',

  props: {
    attributeId: {
      type: String,
      required: true
    },

    schemaData: {
      type: Object,
      default: () => ({})
    },

    proxyProps: {
      type: Object,
      default: () => ({})
    },

    components: {
      type: Object,
      default: () => ({})
    },

    value: {
      type: [String, Number, Array, Object, Boolean, File],
      default: undefined
    }
  },

  computed: {
    /**
     * @return {Object}
     */
    attributeInfo() {
      return this.$store.getters['attributes/one'](this.attributeId);
    },
    /**
     * @return {Object}
     */
    attributeTypeInfo() {
      return this.$store.getters['attributesRegistry/one'](this.attributeInfo.type);
    },

    /**
     * @return {string|number|Array|Object|boolean|File}
     */
    internalValue() {
      return this.value
        || this.schemaData?.data?.attributes?.[this.attributeId];
    }
  }
};

/**
 * @param {Object} componentsMap
 * @return {Vue.Component}
 */
export const AttributeRootComponentMixinFactory = (componentsMap) => ({
  name: 'AttributeComponentMixin',

  mixins: [AttributeMixin],

  methods: {
    /**
     * @return {JSX.Element}
     */
    genFallback() {
      return (
        <div>{this.attributeInfo.title}</div>
      );
    },

    /**
     * @return {null|Vue.Component}
     */
    getAttributeComponent() {
      const { type } = this.attributeInfo;

      if (hasOwnProperty(type, componentsMap)) {
        return componentsMap[type];
      }

      return null;
    },

    /**
     * @return {JSX.Element|null}
     */
    genAttributeComponent() {
      const AttributeComponent = this.getAttributeComponent();
      const { isMultiple } = this.attributeInfo;

      if (AttributeComponent) {
        return (
          <AttributeComponent
            attributeId={this.attributeId}

            isMultiple={isMultiple}

            schemaData={this.schemaData}
            proxyProps={this.proxyProps}
            components={this.components}
            vModel={this.internalValue}
          />
        );
      }

      return null;
    }
  },

  render() {
    return this.genAttributeComponent() || this.genFallback();
  }
});

export const AttributeSchemaMixin = {
  name: 'AbstractAttributeSchemaMixin',

  methods: {
    /**
     * @param {string} type
     * @return {Array|null}
     */
    getAttributeSchema(type) {
      const schema = this.attributeInfo?.schemas?.[type];
      return schema ? wrapInArray(schema) : null;
    },

    /**
     * @param {*} value
     * @return {Object}
     */
    getAttributeSchemaData(value = this.internalValue) {
      return {
        ...this.schemaData,
        attribute: {
          info: this.attributeInfo,
          value: isFile(value) ? value.name : value
        },
        proxyProps: this.proxyProps
      };
    }
  }
};

export const AttributeModelMixin = {
  name: 'AttributeModelMixin',

  model: {
    prop: 'value',
    event: 'input'
  },

  data() {
    return {
      lazyValue: undefined
    };
  },

  computed: {
    internalValue: {
      get() {
        return this.lazyValue;
      },
      set(val) {
        this.lazyValue = val;
        this.$emit('input', val);
      }
    }
  },

  watch: {
    value: {
      handler(value) {
        this.valueHandler(value);
      },
      immediate: true,
      deep: true
    },

    lazyValue: {
      handler(newVal) {
        this.$set(this, 'internalValue', newVal);
      },
      deep: true
    }
  },

  methods: {
    /**
     * Handle and set component value on model change
     * @param {*} value
     */
    valueHandler(value) {
      if (value && !isEqual(value, this.internalValue)) {
        const upd = cloneDeep(value);
        this.$set(this, 'internalValue', upd);
      }
    }
  }
};

export const AttributeMultipleModelMixin = {
  name: 'AttributeMultipleModelMixin',

  mixins: [AttributeModelMixin],

  props: {
    isMultiple: {
      type: Boolean,
      default: false
    }
  },

  // data() {
  //   return {
  //     lazyValue: this.isMultiple ? [] : undefined
  //   };
  // },

  methods: {
    /**
     * Add new item in internalValue array for attributes with isMultiple flag
     * @param {*} itemModel
     */
    addValueItem(itemModel) {
      const upd = cloneDeep(this.internalValue);
      upd.push(itemModel);
      this.$set(this, 'internalValue', upd);
    },

    /**
     * Remove item from internalValue array for attributes with isMultiple flag
     * @param {number} index
     */
    removeValueItem(index) {
      const upd = cloneDeep(this.internalValue);
      upd.splice(index, 1);
      this.$set(this, 'internalValue', upd);
    },

    /**
     * Switch component model to array
     */
    normalizeLazyValue() {
      if (!this.value && this.attributeInfo.isMultiple) {
        this.lazyValue = [];
      }
    },

    /**
     * Add default item to component model
     * @param {*} itemModel
     */
    addInitialValueItem(itemModel) {
      if (this.attributeInfo.isMultiple && !this.lazyValue.length) {
        this.addValueItem(itemModel);
      }
    }
  },

  created() {
    this.normalizeLazyValue();
  }
};

export const AttributeSetMixin = {
  name: 'AttributeSetMixin',

  mixins: [AttributeMixin, AttributeModelMixin],

  data() {
    return {
      validationRules: 'required'
    };
  },

  methods: {
    /**
     * @param {Array} errors
     * @return {JSX.Element|null}
     */
    genErrors(errors) {
      if (errors && errors.length) {
        const err = errors.map((error) => (<div>{error}</div>));
        return (
          <VeStack gap={8}>
            {err}
          </VeStack>
        );
      }

      return null;
    },

    /**
     * @return {JSX.Element}
     */
    genAttribute() {
      return (
        <div>
          {slotPlaceholder('genMultipleItems', this.attributeTypeInfo.label)}
        </div>
      );
    },

    /**
     * @return {JSX.Element}
     */
    genRequiredAttribute() {
      const scopedSlots = {
        default: ({ errors }) => this.genAttribute(errors)
      };

      return (
        <ValidationProvider
          name={this.attributeInfo.title}
          rules={this.validationRules}
          scopedSlots={scopedSlots}
          tag="div"
        />
      );
    }
  },

  render() {
    return this.attributeInfo.isRequired
      ? this.genRequiredAttribute()
      : this.genAttribute();
  }
};

export const AttributeReadMixin = {
  name: 'AttributeReadMixin',

  mixins: [AttributeMixin],

  methods: {
    /**
     * @return {JSX.Element}
     */
    genAttribute() {
      return (
        <div>
          {slotPlaceholder('genSlot', this.attributeTypeInfo.label)}
        </div>
      );
    }
  },

  render() {
    return this.internalValue ? this.genAttribute() : null;
  }
};

export const AttributeOptionsReadMixin = {
  name: 'AttributeOptionsReadMixin',

  computed: {
    /**
     * @return {Array}
     */
    optionsValue() {
      const values = wrapInArray(this.internalValue);

      return collectionList(
        this.attributeInfo.valueOptions,
        { '+value': values }
      );
    },

    /**
     * @return {Array}
     */
    optionsValueTitles() {
      return this.optionsValue.map((v) => v.title);
    }
  }
};
