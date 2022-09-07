import {
  isArray,
  isString,
  isObject,
  isBoolean,
  isNumber,

  pascalCase,

  RecursiveIterator,
  objectPath,

  TemplateStringParser
} from '@casimir.one/toolbox';

import { cloneDeep, merge } from 'lodash';

/**
 * @typedef {Object} SchemaNode
 * @property {string} is
 * @property {string} uid
 * @property {Object} data
 * @property {string} [model]
 * @property {Array} [children]
 * @property {boolean} [condition]
 * @property {string} [text]
 */

/**
 * Schema parser
 */
export default {
  name: 'VlsParser',

  model: {
    prop: 'value',
    event: 'input'
  },

  props: {
    /**
     * Schema
     */
    schema: {
      type: Array,
      default: () => []
    },
    /**
     * Data used in schema
     */
    schemaData: {
      type: Object,
      default: () => ({})
    },
    /**
     * Element in which schema will be rendered
     */
    tag: {
      type: String,
      default: 'div'
    },
    /**
     * Components used in schema that need to be registered
     */
    components: {
      type: Object,
      default: () => ({})
    },

    /**
     * Value
     * @model
     */
    value: {
      type: [String, Object, Array, Boolean, Number, File],
      default: () => ({})
    }
  },

  data() {
    return {
      lazyValue: this.value
    };
  },

  computed: {
    /**
     * Internal value
     *
     */
    internalValue: {
      /**
       * Get value
       * @returns {string|Object|Array|boolean|number|File}
       */
      get() {
        return this.lazyValue;
      },

      /**
       * Set value
       * @param {string|Object|Array|boolean|number|File} val
       */
      set(val) {
        this.lazyValue = val;
        /** Input event */
        this.$emit('input', this.lazyValue);
      }
    }
  },

  watch: {
    value: {
      handler(val) {
        this.lazyValue = val;
      },
      deep: true
    }
  },

  beforeCreate() {
    this.$options.methods.registerComponents.call(this, this.$options.propsData.components);
  },

  methods: {
    /**
     * Register components used in schema
     * @param {Object} components
     */
    registerComponents(components = {}) {
      for (const key of Object.keys(components)) {
        if (key !== this.$options.name) {
          this.$options.components[key] = components[key];
        }
      }
    },

    /**
     * Put data passed in schemaData to schema. Parse schema with TemplateStringParser
     * @param {Array} schema
     * @returns {Array} normalized schema
     */
    normalizeSchema(schema) {
      if (!schema) return false;
      if (!isArray(schema)) throw Error('Schema mus be an Array');

      const clone = cloneDeep(schema);
      const templateStringParser = new TemplateStringParser(this.schemaData);

      for (const { parent, node, key } of new RecursiveIterator(clone, 1, true)) {
        if (isString(node)) {
          parent[key] = templateStringParser.parse(node);
        }
      }

      return clone;
    },

    /**
     * Generate node childred
     * @param {Array.<SchemaNode>|SchemaNode|string} children
     * @returns {Array.<VNode>|VNode|string}
     */
    getChildren(children) {
      if (!children) return false;

      if (isArray(children)) return children.map((n) => this.generateNode(n));
      if (isObject(children)) return this.generateNode(children);
      if (isString(children)) return children;

      throw new Error('Children must be an Array, Object or String');
    },

    /**
     * Generate node
     * @param {SchemaNode} node
     * @returns {VNode|string|null}
     */
    generateNode(node) {
      if (!node) return null;
      if (!isObject(node)) throw new Error('Node must be an Object');

      const {
        is: nodeComponent = 'div',
        data = {},
        children = [],
        condition: rawCondition = true,
        text
      } = node;

      const condition = rawCondition !== '' ? rawCondition : true;

      if (data.proxyProps) {
        objectPath.set(data, ['props', 'proxyProps'], data.proxyProps);
      }

      if (this.$options.components?.[nodeComponent]?.options?.props?.components) {
        objectPath.set(data, ['props', 'components'], this.$options.components);
      }

      const nodeChildren = text || this.getChildren(children);
      let nodeData = merge(data, this.getNodeModelData(node));
      if (Object.keys(this.schemaData).length) {
        nodeData = merge(nodeData, { props: { schemaData: this.schemaData } });
      }

      return condition ? this.$createElement(
        nodeComponent,
        nodeData,
        nodeChildren
      ) : null;
    },

    /**
     * Check if node is native input
     * @param {SchemaNode} node
     * @returns {boolean}
     */
    isNativeInput(node) {
      return [
        'input',
        'select',
        'textarea'
      ].includes(node.is);
    },

    /**
     * Get node model (prop and event names)
     * @param {SchemaNode} node
     * @returns {Object} result
     * @returns {string} result.prop
     * @returns {string} result.event
     * @returns {Array.<string>|boolean} result.path
     */
    getNodeModelProps(node) {
      if (!node?.model) return {};

      const { is: name, model } = node;

      const componentModelProps = this.$options.components?.[pascalCase(name)]?.options?.model
        || this.$options.components?.[pascalCase(name)]?.model
        || {};

      const modelProps = {
        ...{ prop: 'value', event: 'input' },
        ...componentModelProps,
        ...(isBoolean(model) ? { path: false } : {}),
        ...(isString(model) ? { path: model } : {}),
        ...(isObject(model) ? model : {})
      };

      if (!Object.prototype.hasOwnProperty.call(modelProps, 'path')) throw Error('Model must contain path');

      return modelProps;
    },

    /**
     * Get node model prop and listener for setting them to component
     * @param {SchemaNode} node
     * @returns {Object} result
     * @returns {Object} [result.attrs]
     * @returns {Object} [result.props]
     * @returns {Object} result.on
     */
    getNodeModelData(node) {
      if (!node?.model) return {};
      if (
        !isString(node.model)
        && !isObject(node.model)
        && !isArray(node.model)
        && !isBoolean(node.model)
        && !isNumber(node.model)
      ) throw new Error('Model must be an [String, Object, Array, Boolean, Number]');

      const vm = this;

      const isNativeInput = this.isNativeInput(node);
      const modelProps = this.getNodeModelProps(node);

      return {
        [isNativeInput ? 'attrs' : 'props']: {
          [modelProps.prop]: objectPath.get(vm.internalValue, modelProps.path)
        },
        on: {
          [modelProps.event](event) {
            const value = isNativeInput ? event.target.value : event;

            if (!modelProps.path) {
              vm.internalValue = value;
            } else {
              const updatedValue = cloneDeep(vm.internalValue) || {};
              objectPath.set(updatedValue, modelProps.path, value);

              vm.internalValue = updatedValue;
            }
          }
        }
      };
    }
  },

  render(h) {
    return h(
      this.tag,
      this.normalizeSchema(this.schema)
        .map((n) => this.generateNode(n, h))
    );
  }
};
