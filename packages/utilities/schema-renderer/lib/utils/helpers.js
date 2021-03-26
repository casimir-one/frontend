import { cloneDeep } from 'lodash/fp/';
import { genObjectId, isObject, hasValue } from '@deip/toolbox';
import RecursiveIterator from 'recursive-iterator';

export const ifValidBlock = (node) => isObject(node) && Object.prototype.hasOwnProperty.call(node, 'is');

export const clearBlock = (node) => {
  const {
    id,
    is,
    data,
    children
  } = cloneDeep(node);

  const uid =genObjectId({ salt: Math.random() + new Date().getTime().toString() })

  return {
    id, uid, is,
    ...(hasValue(data) ? { data } : {}),
    ...(children ? { children: children.map((ch) => clearBlock(ch)) } : {})
  };
}

export const normalizeBlocksObject = (obj, ext = {}) => {
  const clone = cloneDeep(obj);
  for (const { node } of new RecursiveIterator(clone)) {
    if (ifValidBlock(node)) {
      node.id = genObjectId(node);

      for (const key of Object.keys(ext)) {
        if (!node[key]) {
          node[key] = ext[key];
        }
      }
    }
  }

  return clone;
};
