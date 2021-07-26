import {
  filterObjectKeys,
  genObjectId,
  isArray,
  isObject,
  wrapInArray,

  capitalCase,
  paramCase,

  RecursiveIterator, objectPath
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

export const convertBlockProps = (props) => Object.keys(props)
  .reduce((acc, prop) => {
    let propVal = props[prop];

    // if (isString(props[prop])) {
    //   propVal = props[prop];
    // }

    if (props[prop].type) {
      propVal = props[prop].type();
    }

    if (props[prop].default) {
      propVal = props[prop].default;
    }

    return {
      ...acc,
      ...{ [prop]: propVal }
    };
  }, {});

export const normalizeProps = (node) => {
  const res = cloneDeep(node);
  const props = node?.data?.props;
  const proxyProps = node?.data?.proxyProps;

  if (props) {
    objectPath.set(res, ['data', 'props'], convertBlockProps(props));
    // res.data.props = convertBlockProps(res.data.props);
  }

  if (proxyProps) {
    objectPath.set(res, ['data', 'proxyProps'], convertBlockProps(Object.keys(proxyProps)
      .reduce((acc, component) => ({
        ...acc,
        ...{ [component]: convertBlockProps(proxyProps[component]) }
      }), {})));
  }
  return res;
};

export const clearBlock = (node) => {
  const res = filterObjectKeys(cloneDeep(node), RENDERER_SCHEME_BLOCK_KEYS);

  res.uid = genObjectId({ salt: Math.random() + new Date().getTime().toString() });

  if (res.children) {
    if (isArray(res.children)) {
      res.children = res.children.map((ch) => clearBlock(ch));
    } else {
      delete res.children;
    }
  }

  return normalizeProps(res);
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

export const blocksGenerator = (blocks) => wrapInArray(blocks)
  .map((block) => {
    const { component } = block;
    const componentOptions = component.options || component;

    const componentProps = componentOptions?.props || {};
    const blockProps = block?.data?.props || {};
    const proxyProps = block?.data?.proxyProps || {};

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
