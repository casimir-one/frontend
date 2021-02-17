import { camelCase } from 'change-case';
import sortKeys from 'sort-keys';
import crc32 from 'crc/crc32';

import { isObject } from './verification';

export const mergeDeep = (source = {}, target = {}) => {
  const res = { ...source };
  for (const key in target) {
    const sourceProperty = res[key];
    const targetProperty = target[key];

    if (isObject(sourceProperty) && isObject(targetProperty)) {
      res[key] = mergeDeep(sourceProperty, targetProperty);
    } else {
      res[key] = targetProperty;
    }
  }

  return res;
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

export const camelizeObjectKeys = (obj) => {
  if (!obj) return {};
  return Object.keys(obj)
    .reduce((o, key) => ({ ...o, ...{ [camelCase(key)]: obj[key] } }), {});
};

export const excludeObjectKeys = (obj, keys = []) => {
  if (!keys.length) return obj;

  const filtered = {};

  for (const key of Object.keys(obj)) {
    if (!keys.includes(key)) {
      filtered[key] = obj[key];
    }
  }

  return filtered;
};

export const genObjectId = (obj, turns = 3) => {
  const sorted = sortKeys(obj, { deep: true });

  return new Array(turns)
    .fill(null)
    .map((x, index) => index)
    .reduce((x, index) => x + crc32(`turn-${index + 1}-${JSON.stringify(sorted)}`)
      .toString(16), '');
};
