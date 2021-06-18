import {
  isArray, isString, isObject, isBoolean, isNumber
} from '@deip/toolbox';
import { cloneDeep, merge } from 'lodash/fp/';
import dotProp from 'dot-prop';
import RecursiveIterator from 'recursive-iterator';
import { pascalCase } from 'change-case';

export const SchemaRenderer = {
  name: 'SchemeRenderer',

  model: {
    prop: 'value',
    event: 'input'
  },

  props: {
    schema: {
      type: Array,
      default: () => []
    },
    schemaData: {
      type: Object,
      default: () => ({})
    },
    tag: {
      type: String,
      default: 'div'
    },
    components: {
      type: Object,
      default: () => ({})
    },

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
    internalValue: {
      get() {
        return this.lazyValue;
      },

      set(val) {
        this.lazyValue = val;
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
    const externals = this.$options.propsData.components;

    for (const name in externals) {
      if (Object.hasOwnProperty.call(externals, name)) {
        this.$options.components[name] = externals[name];
      }
    }
  },

  methods: {
    normalizeSchema(schema) {
      if (!schema) return false;
      if (!isArray(schema)) throw Error('Schema mus be an Array');

      const clone = cloneDeep(schema);

      for (const { parent, node, key } of new RecursiveIterator(clone, 1, true)) {
        if (isString(node)) {
          let nodeString = node;

          const stringPattern = /{{\s*(.*?)\s*}}/gm;
          const stringMatches = [...nodeString.matchAll(stringPattern)];
          if (stringMatches && stringMatches.length) {
            nodeString = node
              .replace(stringPattern, (...args) => dotProp.get(this.schemaData, args[1]));
          }

          const modelPattern = /^@([a-zA-Z0-9_.-]*)$/;
          const modelMatches = nodeString.match(modelPattern);
          if (modelMatches && modelMatches.length) {
            nodeString = dotProp.get(this.schemaData, modelMatches[1]);
          }

          const methodPattern = /^@([a-zA-Z0-9_.-]*\((['"]?[a-zA-Z0-9_,.-]*['"]?[,]?[ ]?)*\))$/;
          const methodMatches = nodeString.match(methodPattern);
          if (methodMatches && methodMatches.length) {
            // eslint-disable-next-line no-eval
            nodeString = eval(`this.schemaData.${methodMatches[1]}`);
          }

          parent[key] = nodeString;
        }
      }

      return clone;
    },

    getChildren(children) {
      if (!children) return false;

      if (isArray(children)) return children.map((n) => this.generateNode(n));
      if (isObject(children)) return this.generateNode(children);
      if (isString(children)) return children;

      throw new Error('Children must be an Array, Object or String');
    },

    generateNode(node) {
      if (!node) return null;
      if (!isObject(node)) throw new Error('Node must be an Object');

      const {
        is: nodeComponent = 'div',
        data = {},
        children = [],
        condition = true,
        text
      } = node;

      const nodeChildren = text || this.getChildren(children);
      let nodeData = merge(data, this.getNodeModelData(node));
      if (Object.keys(this.schemaData).length) {
        nodeData = merge(nodeData, { props: { schemaData: this.schemaData } });
      }
      // eslint-disable-next-line no-eval
      return eval(`${condition}`) ? this.$createElement(
        nodeComponent,
        nodeData,
        nodeChildren
      ) : null;
    },

    isNativeInput(node) {
      return [
        'input',
        'select',
        'textarea'
      ].includes(node.is);
    },

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
          [modelProps.prop]: dotProp.get(vm.internalValue, modelProps.path)
        },
        on: {
          [modelProps.event](event) {
            const value = isNativeInput ? event.target.value : event;

            if (value) {
              if (!modelProps.path) {
                vm.internalValue = value;
              } else {
                vm.internalValue = merge(
                  vm.internalValue,
                  dotProp.set({}, modelProps.path, value)
                );
              }
            } else {
              vm.internalValue = value;
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
