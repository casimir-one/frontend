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

// TODO: rename to validateAssert or something more abstarct
/**
 export const validateConditionFabric = (failureMessage) => {
   return {
     validate(condition, failureMessage) {
       if (condition) return;
       throw new Error(failureMessage);
     }
   }
 }
 export validateCondition = validateConditionFabric().validate

 import { validateCondition, validateConditionFabric } from '...';

 const assertValidation = validateConditionFabric('Assertion failed')
 assertValidation(cond);

 validateCondition(cond, 'alarma!!!')
*/
export const assert = (condition, failureMessage = 'Assertion failed') => {
  if (condition) return;
  throw new Error(failureMessage);
};

export const validateAccountName = (
  value,
  suffix = 'Account name'
) => {
  if (!value) {
    return {
      valid: false,
      error: `${suffix} should not be empty.`
    };
  }
  if (!/^[a-z]/.test(value)) {
    return {
      valid: false,
      error: `${suffix} should start with a small letter.`
    };
  }
  if (!/^[a-z0-9-]*$/.test(value)) {
    return {
      valid: false,
      error: `${suffix} should have only small letters, digits, or dashes.`
    };
  }
  if (/--/.test(value)) {
    return {
      valid: false,
      error: `${suffix} should have only one dash in a row.`
    };
  }
  if (!/[a-z0-9]$/.test(value)) {
    return {
      valid: false,
      error: `${suffix} should end with a small letter or digit.`
    };
  }
  if (value.length < 3) {
    return {
      valid: false,
      error: `${suffix} should be longer`
    };
  }
  if (value.length > 40) {
    return {
      valid: false,
      error: `${suffix} should be shorter`
    };
  }

  return {
    valid: true
  };
};
