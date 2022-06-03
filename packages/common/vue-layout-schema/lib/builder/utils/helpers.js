import {
  filterObjectKeys,
  genObjectId,
  isArray,
  isObject,
  wrapInArray,

  capitalCase,
  paramCase,

  RecursiveIterator, objectPath, isFunction, assert
} from '@deip/toolbox';

import { cloneDeep } from 'lodash';

import {
  RENDERER_SCHEMA_BLOCK_KEYS,
  RENDERER_BLOCK_KEYS
} from '@deip/constants';

/**
 * @typedef {Object} InitialBlock
 * @property {string} blockType
 * @property {Object} [data]
 * @property {Object} [data.props]
 * @property {Object} [data.proxyProps]
 * @property {Array.<string>} [disabledProps]
 * @property {string} icon
 * @property {string} [id]
 * @property {VNode} component
 * @property {string} [layoutType]
 * @property {string} name
 * @property {Array.<string>} [scope]
 * @property {string} [text]
 */

/**
 * @typedef {Object} Block
 * @property {string} blockType
 * @property {Object} [data]
 * @property {Object} [data.props]
 * @property {Object} [data.proxyProps]
 * @property {Array.<string>} [disabledProps]
 * @property {string} icon
 * @property {string} [id]
 * @property {string} is
 * @property {string} [layoutType]
 * @property {string} name
 * @property {Array.<string>} [scope]
 * @property {string} [text]
 */

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
 * Check if node is valid
 * @param {Object} node
 * @param {string} node.is
 * @returns {boolean}
 */
export const ifValidBlock = (node) => (
  isObject(node)
  && Object.prototype.hasOwnProperty.call(node, 'is')
);

/**
 * Prepare block props for being used in component
 * @param {Object} props
 * @returns {Object}
 */
export const convertBlockPropsValueForCanvas = (props) => Object.keys(props)
  .reduce((acc, prop) => {
    let propVal;

    const {
      type,
      default: defaultValue
    } = props[prop];

    if (defaultValue) {
      propVal = defaultValue;
    } else if (!defaultValue && type) {
      propVal = undefined;
    } else {
      propVal = props[prop];
    }

    return {
      ...acc,
      ...{ [prop]: propVal }
    };
  }, {});

/**
 * Prepare block props for being user on canvas
 * @param {SchemaNode} node
 * @returns {SchemaNode}
 */
export const convertBlockPropsForCanvas = (node) => {
  const res = cloneDeep(node);
  const props = node?.data?.props;
  const proxyProps = node?.data?.proxyProps;

  if (props) {
    objectPath.set(res, ['data', 'props'], convertBlockPropsValueForCanvas(props));
    // res.data.props = convertBlockPropsValueForCanvas(res.data.props);
  }

  if (proxyProps) {
    const setData = convertBlockPropsValueForCanvas(Object.keys(proxyProps)
      .reduce((acc, component) => ({
        ...acc,
        ...{ [component]: convertBlockPropsValueForCanvas(proxyProps[component]) }
      }), {}));

    objectPath.set(res, ['data', 'proxyProps'], setData);
  }

  return res;
};

/**
 * Prepare block for being used in schema - add id and prepare children
 * @param {Block} node
 * @returns {SchemaNode}
 */
export const convertBlockForSchema = (node) => {
  const res = filterObjectKeys(cloneDeep(node), RENDERER_SCHEMA_BLOCK_KEYS);

  res.uid = genObjectId({ salt: Math.random() + new Date().getTime().toString() });

  if (res.children) {
    if (isArray(res.children)) {
      res.children = res.children.map((ch) => convertBlockForSchema(ch));
    } else {
      delete res.children;
    }
  }

  return convertBlockPropsForCanvas(res);
};

/**
 * Generate readable name form component name
 * @param {string} name
 * @returns {string}
 */
export const generateBlockName = (name) => {
  let res = paramCase(name);

  res = res.replace(/^v-|^vex-/, '');

  return capitalCase(res);
};

/**
 * Check block and add id if not presented
 * @param {Block} obj
 * @returns {Block}
 */
export const normalizeBlocksObject = (obj) => {
  for (const { node } of new RecursiveIterator(wrapInArray(obj), 1, true)) {
    if (ifValidBlock(node)) {
      if (!node.id) {
        node.id = genObjectId({ name: node.name });
      }
    }
  }
  return obj;
};

/**
 * Cast prop to object
 * @param {Function|Object|string} prop
 * @returns
 */
const normalizeBlockProp = (prop) => {
  if (isFunction(prop)) {
    return {
      type: prop,
      default: undefined
    };
  }

  if (
    isFunction(prop.default)
    && (isArray(prop.default()) || isObject(prop.default()))
  ) {
    return {
      type: prop.type,
      default: prop.default()
    };
  }

  return prop;
};

/**
 * Cast props to object
 * @param {Array|Object} props
 * @returns {Object}
 */
const normalizeBlockProps = (props) => {
  if (!props || !Object.keys(props).length) return {};

  if (isArray(props)) {
    return props
      .reduce((acc, prop) => ({
        ...acc,
        ...{
          [prop]: {
            type: String,
            default: undefined
          }
        }
      }), {});
  }

  return Object.keys(props)
    .reduce((acc, prop) => ({
      ...acc,
      ...{ [prop]: normalizeBlockProp(props[prop]) }
    }), {});
};

/**
 * Filter props by name
 * @param {Object} componentProps
 * @param {Array.<string>} filter
 * @param {boolean} exclude flag -exlude or include props
 * @returns {Object}
 */
const filterProps = (
  componentProps,
  filter,
  exclude
) => {
  if (filter === '*' && exclude) {
    return {};
  }

  if (filter === '*' && !exclude) {
    return componentProps;
  }

  return filterObjectKeys(componentProps, filter, exclude);
};

/**
 * Prepare blocks for being used in builder
 * @param {InitialBlock|Array.<InitialBlock>} blocks
 * @returns {Array.<Block>}
 */
export const blocksGenerator = (blocks) => wrapInArray(blocks)
  .map((block) => {
    const { component } = block;

    if (!component) {
      throw new Error('[blocksGenerator]: component not defined');
    }

    const componentOptions = component.options || component;

    const componentProps = normalizeBlockProps(componentOptions?.props);
    const blockProps = normalizeBlockProps(block?.data?.props);
    const proxyProps = normalizeBlockProps(block?.data?.proxyProps);

    assert(
      !(block.excludeProps && block.includeProps),
      '[blocksGenerator]: You can`t use "excludeProps" and "includeProps" at same time'
    );

    const resultProps = filterProps(
      { ...componentProps, ...blockProps },
      block.excludeProps || block.includeProps,
      !!block.excludeProps
    );

    const data = {
      ...(Object.keys(resultProps).length ? { props: resultProps } : {}),
      ...(Object.keys(proxyProps).length ? { proxyProps } : {})
    };

    return normalizeBlocksObject({
      ...filterObjectKeys(block, RENDERER_BLOCK_KEYS),
      ...{
        is: componentOptions.name,
        name: block.blockName || generateBlockName(componentOptions.name),
        ...(Object.keys(data).length ? { data } : {})
      }
    });
  });
