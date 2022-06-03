import {
  isObject, isString, isNumeric, isArray
} from '../verification';

/**
  * Add value to enum
  * @param {Object} enumObj
  * @param {string} key
  * @param {string|number} value
*/
export function addValueToEnum(enumObj, key, value) {
  if (typeof value === 'undefined') {
    // eslint-disable-next-line no-param-reassign
    value = Math.max.apply(
      null,
      [...Object.values(enumObj).map((it) => +it).filter((it) => !Number.isNaN(it)), -1]
    ) + 1;
  }

  if (Number.isNaN(value)) {
    // eslint-disable-next-line no-param-reassign
    enumObj[key] = value;
  } else {
    // eslint-disable-next-line no-param-reassign
    enumObj[enumObj[key] = value] = key;
  }
}

/**
  * Create enum object from items
  * @param {Array|Object} items
  * @returns {Object}
*/
export function createEnum(items) {
  const enumObj = {};

  if (isArray(items)) {
    items.forEach((it) => (isString(it)
      ? addValueToEnum(enumObj, it)
      : addValueToEnum(enumObj, it.key, it.value)));
  }

  if (isObject(items)) {
    Object.keys(items).forEach((it) => isString(it) && addValueToEnum(enumObj, it, items[it]));
  }

  const keys = () => Object.keys(enumObj)
    .reduce((res, key) => ([...res, ...(!isNumeric(key) ? [key] : [])]), []);
  const values = () => Object.keys(enumObj)
    .reduce((res, key) => ([...res, ...(isNumeric(key) ? [parseInt(key)] : [])]), []);

  return {
    ...enumObj,
    ...{
      keys,
      values
    }
  };
}

/**
  * Map list from enum
  * @param {Object} enumObj
  * @param {Array} data
  * @returns {Array.<Object>}
*/
export const mapListFromEnum = (enumObj, data) => enumObj.values().map((value) => ({
  value: parseInt(value),
  text: data[value]
}));
