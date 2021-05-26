import { camelCase } from 'change-case';
import sortKeys from 'sort-keys';
import crc32 from 'crc/crc32';

import { isObject } from './verification';

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
  const sorted = sortKeys(obj, { deep: true });

  return new Array(turns)
    .fill(null)
    .map((x, index) => index)
    .reduce((x, index) => x + crc32(`turn-${index + 1}-${JSON.stringify(sorted)}`)
      .toString(16), '');
};
