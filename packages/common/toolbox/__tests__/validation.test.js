import {
  isArray,
  isObject,
  isFile,
  isFunction,
  isBoolean,
  isString,
  isNumber,
  isNumeric,
  isNil,
  isSimpleVal,
  isJsonString,
  hasValue,
  hasOwnProperty,
  assert
} from '../src';

const checkFunction = (checkedFn, parametersForFalse, parametersForTrue) => {
  it.each(parametersForFalse)('should return false for %s', (initial) => {
    expect(checkedFn(initial)).toEqual(false);
  });

  it.each(parametersForTrue)('should return true for %s', (initial) => {
    expect(checkedFn(initial)).toEqual(true);
  });
};

describe('isArray', () => {
  checkFunction(
    isArray,
    [null, undefined, '', 'a', 1, true, {}],
    [[[]], [[1, 2]]]
  );
});

describe('isObject', () => {
  checkFunction(
    isObject,
    [null, undefined, '', 'a', 1, true, []],
    [{}, { a: 'a', b: 1 }]
  );
});

describe('isFile', () => {
  checkFunction(
    isFile,
    [null, undefined, '', 'a', 1, true, {}, []],
    [new File([], 'filename')]
  );
});

describe('isFunction', () => {
  checkFunction(
    isFunction,
    [null, undefined, '', 'a', 1, true, {}, []],
    [jest.fn()]
  );
});

describe('isBoolean', () => {
  checkFunction(
    isBoolean,
    [null, undefined, '', 'true', 1, {}, []],
    [true, false]
  );
});

describe('isString', () => {
  checkFunction(
    isString,
    [null, undefined, true, 1, {}, []],
    ['', 'a']
  );
});

describe('isNumber', () => {
  checkFunction(
    isNumber,
    [null, undefined, true, '1', {}, []],
    [1, 1.5, -1, 0, NaN]
  );
});

describe('isNumeric', () => {
  checkFunction(
    isNumeric,
    [null, undefined, true, 0, 'q', NaN, {}, []],
    ['100', '-100', '1.1']
  );
});

describe('isNil', () => {
  checkFunction(
    isNil,
    [0, 1, NaN, '1', false, {}, []],
    [null, undefined]
  );
});

describe('isSimpleVal', () => {
  checkFunction(
    isSimpleVal,
    [null, undefined, new Date(), {}, []],
    [1, '2', NaN, true]
  );
});

describe('isJsonString', () => {
  checkFunction(
    isJsonString,
    [null, undefined, new Date(), {}, [], '{"a":1'],
    ['{"a": 1, "b": {"1": "1"}, "c":[]}']
  );
});

describe('hasValue', () => {
  checkFunction(
    hasValue,
    [null, undefined, NaN, '', {}, []],
    [1, '2', true, false, { a: 1 }, [1]]
  );
});

describe('hasOwnProperty', () => {
  it.each([
    null,
    undefined,
    1,
    '',
    {},
    { b: '1', c: { a: '2' } },
    []
  ])('should return false for %s', (initial) => {
    expect(hasOwnProperty('a', initial)).toEqual(false);
  });

  it.each([{ a: 1 }])('should return true for %s', (initial) => {
    expect(hasOwnProperty('a', initial)).toEqual(true);
  });
});

describe('assert', () => {
  it.each([null, undefined, false])('should throw error for %s', (initial) => {
    expect(() => { assert(initial); }).toThrow('Assertion failed');
  });

  it('should throw error with custom message', () => {
    expect(() => { assert(false, 'Custom error message'); }).toThrow('Custom error message');
  });

  it.each([true])('should return true for %s', (initial) => {
    expect(() => { assert(initial); }).not.toThrow();
  });
});
