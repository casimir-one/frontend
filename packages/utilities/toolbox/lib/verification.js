import kindOf from 'kind-of';

export const isArray = (val) => kindOf(val) === 'array';
export const isObject = (val) => kindOf(val) === 'object';
export const isFile = (val) => kindOf(val) === 'file';

export const isFunction = (val) => kindOf(val) === 'function';

export const isBoolean = (val) => kindOf(val) === 'boolean';
export const isString = (val) => kindOf(val) === 'string';
export const isNumber = (val) => kindOf(val) === 'number';
export const isNumeric = (val) => {
  if (isNumber(val)) return false;
  return !Number.isNaN(val) && !Number.isNaN(Number.parseFloat(val));
};

export const isSimpleVal = (val) => ['boolean', 'string', 'number'].includes(kindOf(val));

export const isJsonString = (str) => {
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

export const hasValue = (value) => {
  if (!value) return false;

  const res = [];

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

export const hasOwnProperty = (prop, obj) => {
  if (kindOf(obj) !== 'object') return false;

  return Object.prototype.hasOwnProperty.call(obj, prop);
};

export const assert = (condition, failureMessage = 'Assertion failed') => {
  if (condition) return;
  throw new Error(failureMessage);
};
