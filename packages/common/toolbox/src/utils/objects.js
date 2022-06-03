import { camelCase } from 'change-case';
import crc32 from 'crc/crc32';
import { cloneDeep, sortBy } from 'lodash';
import { find as deepFind } from 'find-keypath';
import objectPath from 'object-path';

import { isArray, isObject, isSimpleVal } from '../verification';
import { assert } from './assert';

/**
 * @param {Object} obj
 * @param {function} comparator
 * @return {Object}
 */
export const sortObjectKeys = (obj, comparator) => {
  const clone = cloneDeep(obj);

  if (isArray(clone)) {
    return clone.map((i) => sortObjectKeys(i));
  }

  if (isObject(clone)) {
    const keys = sortBy(
      Object.keys(clone),
      (key) => (comparator ? comparator(obj[key], key) : key)
    );

    return keys.reduce((acc, key) => ({
      ...acc,
      ...{ [key]: sortObjectKeys(obj[key]) }
    }), {});
  }

  return clone;
};

/**
 * @param {Object} obj
 * @return {Object}
 */
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

/**
 * @param {Object} obj
 * @param {string[]} [exception=['_id', '__v']]
 * @return {Object}
 */
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

/**
 * @param {Object} obj
 * @param {number} [turns = 3]
 * @return {string}
 */
export const genObjectId = (obj, turns = 3) => {
  const sorted = sortObjectKeys(obj);

  return new Array(turns)
    .fill(null)
    .map((x, index) => index)
    .reduce((x, index) => x + crc32(`turn-${index + 1}-${JSON.stringify(sorted)}`)
      .toString(16), '');
};

/**
 * @param {Object} obj
 * @param {string[]} keys
 * @param {boolean} isExclude
 * @return {Object}
 */
export const filterObjectKeys = (obj, keys, isExclude = false) => {
  if (!keys) return obj;

  const filterKeys = Object.keys(obj)
    .filter((key) => keys.includes(key) === !isExclude);

  return filterKeys.reduce((acc, key) => ({
    ...acc,
    ...({ [key]: obj[key] })
  }), {});
};

/**
 * @param {boolean} condition
 * @param {string} failureMessage
 * @return {assert}
 */
const deepFindAssert = (
  condition,
  failureMessage
) => {
  assert(
    condition,
    `[deepFindParentByValue]: ${failureMessage}`
  );
};

/**
 * Find string value in object
 * @param {Object} obj
 * @param {string} value
 * @param {boolean} returnObject
 * @return {{path: string[], data: Object} | Object}
 */
export const deepFindParentByValue = (obj, value, returnObject = false) => {
  deepFindAssert(!!obj, 'You must specify object');
  deepFindAssert(!!value, 'You must specify search value');
  deepFindAssert(isSimpleVal(value), 'Value must be a primitive');

  const path = deepFind(obj, value).slice(0, -1);

  if (!path.length) {
    return undefined;
  }

  const data = objectPath.get(obj, path);

  return returnObject ? { path, data } : data;
};
