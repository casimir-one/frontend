import kindOf from 'kind-of';

/**
 * Checks if value is Array
 * @param {*} val
 * @returns {boolean}
 */
export const isArray = val => kindOf(val) === 'array';

/**
 * Checks if value is Object
 * @param {*} val
 * @returns {boolean}
 */
export const isObject = val => kindOf(val) === 'object';

/**
 * Checks if value is File
 * @param {*} val
 * @returns {boolean}
 */
export const isFile = val => kindOf(val) === 'file';

/**
 * Checks if value is Function
 * @param {*} val
 * @returns {boolean}
 */
export const isFunction = val => kindOf(val) === 'function';

/**
 * Checks if value is Boolean
 * @param {*} val
 * @returns {boolean}
 */
export const isBoolean = val => kindOf(val) === 'boolean';

/**
 * Checks if value is String
 * @param {*} val
 * @returns {boolean}
 */
export const isString = val => kindOf(val) === 'string';

/**
 * Checks if value is Number
 * @param {*} val
 * @returns {boolean}
 */
export const isNumber = val => kindOf(val) === 'number';

/**
 * Checks if value is null or undefined
 * @param {*} val
 * @returns {boolean}
 */
export const isNil = val => val === undefined || val === null;

/**
 * Checks if value is numeric string
 * @param {*} val
 * @returns {boolean}
 */
export const isNumeric = val => {
  if (isNumber(val)) return false;
  return !Number.isNaN(val) && !Number.isNaN(Number.parseFloat(val));
};

/**
 * Checks if value is boolean, string or number
 * @param {*} val
 * @returns {boolean}
 */
export const isSimpleVal = val => ['boolean', 'string', 'number'].includes(kindOf(val));

/**
 * Checks if value is JSON string
 * @param {*} str
 * @returns {boolean}
 */
export const isJsonString = str => {
  if (!isString(str)) {
    return false;
  }

  try {
    JSON.parse(str);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Checks if value is not nil or empty
 * @param {*} value
 * @returns {boolean}
 */
export const hasValue = value => {
  if (isNil(value)) return false;
  const res = [];

  if (isBoolean(value)) {
    res.push(true);
  }

  if (isSimpleVal(value)) {
    res.push(!!value);
  }

  if (isArray(value)) {
    for (const item of value) {
      res.push(hasValue(item));
    }
  }

  if (isObject(value)) {
    if (Object.keys(value).length) {
      for (const item of Object.values(value)) {
        res.push(hasValue(item));
      }
    } else {
      res.push(false);
    }
  }

  return res.includes(true);
};

/**
 * Check if object has property
 * @param {string} prop
 * @param {Object} obj
 * @returns {boolean}
 */
export const hasOwnProperty = (prop, obj) => {
  if (kindOf(obj) !== 'object') return false;
  return Object.prototype.hasOwnProperty.call(obj, prop);
};