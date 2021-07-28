import {
  filterObjectKeys,
  genObjectId,
  isArray,
  isObject,
  wrapInArray,

  capitalCase,
  paramCase,

  RecursiveIterator, objectPath, isFunction
} from '@deip/toolbox';

import { cloneDeep } from '@deip/toolbox/lodash';

import {
  RENDERER_SCHEME_BLOCK_KEYS,
  RENDERER_BLOCK_KEYS
} from '@deip/constants';

export const ifValidBlock = (node) => (
  isObject(node)
  && Object.prototype.hasOwnProperty.call(node, 'is')
);

export const setBlockPropsValueForCanvas = (props) => Object.keys(props)
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

export const convertBlockPropsForCanvas = (node) => {
  const res = cloneDeep(node);
  const props = node?.data?.props;
  const proxyProps = node?.data?.proxyProps;

  if (props) {
    objectPath.set(res, ['data', 'props'], setBlockPropsValueForCanvas(props));
    // res.data.props = setBlockPropsValueForCanvas(res.data.props);
  }

  if (proxyProps) {
    objectPath.set(res, ['data', 'proxyProps'], setBlockPropsValueForCanvas(Object.keys(proxyProps)
      .reduce((acc, component) => ({
        ...acc,
        ...{ [component]: setBlockPropsValueForCanvas(proxyProps[component]) }
      }), {})));
  }
  return res;
};

export const convertBlockForSchema = (node) => {
  const res = filterObjectKeys(cloneDeep(node), RENDERER_SCHEME_BLOCK_KEYS);

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

export const generateBlockName = (name) => {
  let res = paramCase(name);

  if (/^v-/.test(res)) res = res.replace('v-', '');
  if (/^vex-/.test(res)) res = res.replace('vex-', '');

  return capitalCase(res);
};

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
    .reduce((acc, prop) => {
      let propVal;

      if (isFunction(props[prop])) {
        propVal = {
          type: props[prop],
          default: undefined
        };
      } else {
        propVal = props[prop];
      }

      return {
        ...acc,
        ...{
          [prop]: propVal
        }
      };
    }, {});
};

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

    const resultProps = filterObjectKeys(
      { ...componentProps, ...blockProps },
      block.excludeProps,
      true
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
