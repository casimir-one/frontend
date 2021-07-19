import { camelCase } from 'change-case';
import crc32 from 'crc/crc32';
import { cloneDeep, sortBy } from 'lodash/fp';
import { find as deepFind } from 'find-keypath';
import dotProp from 'dot-prop';
import { isArray, isObject } from './validation';

export const sortObjectKeys = (obj, comparator) => {
  const clone = cloneDeep(obj);

  if (isArray(clone)) {
    return clone.map((i) => sortObjectKeys(i));
  }

  if (isObject(clone)) {
    const keys = sortBy(
      (key) => (comparator ? comparator(obj[key], key) : key),
      Object.keys(clone)
    );

    return keys.reduce((acc, key) => ({
      ...acc,
      ...{ [key]: sortObjectKeys(obj[key]) }
    }), {});
  }

  return clone;
};

export const deepFreeze = (obj) => {
  const propsNames = Object.getOwnPropertyNames(obj);
  propsNames.forEach((name) => {
    const prop = obj[name];

    if (isObject(prop) && prop !== null) {
      deepFreeze(prop);
    }
  });
  return Object.freeze(obj);
};

export const camelizeObjectKeys = (obj, exception = ['_id', '__v']) => {
  if (!obj) return {};
  return Object.keys(obj)
    .reduce((o, key) => ({
      ...o,
      ...{
        [exception.includes(key) ? key : camelCase(key)]: obj[key]
      }
    }), {});
};

export const genObjectId = (obj, turns = 3) => {
  const sorted = sortObjectKeys(obj);

  return new Array(turns)
    .fill(null)
    .map((x, index) => index)
    .reduce((x, index) => x + crc32(`turn-${index + 1}-${JSON.stringify(sorted)}`)
      .toString(16), '');
};

export const filterObjectKeys = (obj, keys, reverse = false) => {
  if (!keys) return obj;

  const filterKeys = Object.keys(obj)
    .filter((key) => keys.includes(key) === !reverse);

  return filterKeys.reduce((acc, key) => ({
    ...acc,
    ...({ [key]: obj[key] })
  }), {});
};

export const deepFindParentByValue = (obj, value) => {
  const path = deepFind(obj, value).slice(0, -1);
  return dotProp.get(obj, path.join('.'));
};
