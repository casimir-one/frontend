import {
  filterObjectKeys,
  genObjectId,
  isArray,
  isObject,
  wrapInArray,

  capitalCase,
  paramCase,

  RecursiveIterator
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
    const propVal = isObject(props[prop])
      ? props[prop].default
      : props[prop];

    return {
      ...acc,
      ...{ [prop]: propVal }
    };
  }, {});

export const clearBlock = (node) => {
  const res = filterObjectKeys(cloneDeep(node), RENDERER_SCHEME_BLOCK_KEYS);

  res.uid = genObjectId({ salt: Math.random() + new Date().getTime().toString() });

  if (res?.data?.props) {
    res.data.props = convertBlockProps(res.data.props);
  }

  if (res.children) {
    if (isArray(res.children)) {
      res.children = res.children.map((ch) => clearBlock(ch));
    } else {
      delete res.children;
    }
  }

  return res;
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
  .map((componentOptions) => {
    const res = cloneDeep(componentOptions);

    res.is = res.name;

    res.name = res.blockName || generateBlockName(res.name);
    delete res.blockName;

    if (res.props) {
      res.data = { props: filterObjectKeys(res.props, res.excludeProps, true) };
      delete res.props;
    }

    return normalizeBlocksObject(
      filterObjectKeys(res, RENDERER_BLOCK_KEYS)
    );
  });
