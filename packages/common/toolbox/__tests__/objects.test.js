import {
  deepFreeze,
  camelizeObjectKeys,
  filterObjectKeys,
  deepFindParentByValue
} from '../lib/objects';

describe('deepFreeze', () => {
  it('should freeze object at all levels', () => {
    const object = {
      _id: 1,
      publicProfile: {
        personalNo: 111
      }
    };
    const result = deepFreeze(object);
    expect(result).toBeFrozen();
    expect(result.publicProfile).toBeFrozen();
  });
});

describe('camelizeObjectKeys', () => {
  it('should return empty object', () => {
    expect(camelizeObjectKeys(null)).toEqual({});
  });

  it('should camelize object keys only on the first level', () => {
    const object = {
      _id: 1,
      public_profile: {
        personal_no: 111
      }
    };
    const expectedResult = {
      _id: 1,
      publicProfile: {
        personal_no: 111
      }
    };
    expect(camelizeObjectKeys(object)).toEqual(expectedResult);
  });
});

describe('filterObjectKeys', () => {
  const obj = {
    a: 'a',
    b: 'b',
    c: 'c',
    1: 1
  };
  it('should return empty object', () => {
    expect(filterObjectKeys({}, ['a'])).toMatchObject({});
  });

  it.each([
    [['a', 1], { a: 'a' }],
    [['a', '1'], { 1: 1, a: 'a' }],
    [[], {}],
    [undefined, obj]
  ])('should return filtered object for keys %s', (initial, expected) => {
    expect(filterObjectKeys(obj, initial)).toMatchObject(expected);
  });

  it.each([
    [['a', 1], { b: 'b', c: 'c', 1: 1 }],
    [['a', '1'], { b: 'b', c: 'c' }],
    [[], obj],
    [undefined, obj]
  ])('should return filtered object for keys %s with reverse=true', (initial, expected) => {
    expect(filterObjectKeys(obj, initial, true)).toMatchObject(expected);
  });
});

describe('deepFindParentByValue', () => {
  const testObject1 = {
    id: 1,
    attributes: {
      children: ['a', 'b', 'c']
    }
  };
  const testObject2 = {
    data: [
      testObject1
    ]
  };

  it.each([
    null,
    undefined
  ])('should return error for %s as object', (object) => {
    expect(() => { deepFindParentByValue(object, 1); }).toThrow();
  });

  it.each([
    null,
    undefined,
    '',
    {}
  ])('should return error for %s as value', (value) => {
    expect(() => { deepFindParentByValue(testObject1, value); }).toThrow();
  });

  it.each([
    [1, testObject1],
    ['b', ['a', 'b', 'c']]
  ])('should return expected value for %s', (initial, expected) => {
    expect(deepFindParentByValue(testObject2, initial)).toMatchObject(expected);
  });

  it.each([
    [1, { path: ['data', '0'], data: testObject1 }],
    ['b', { path: ['data', '0', 'attributes', 'children'], data: ['a', 'b', 'c'] }]
  ])('should return expected value for %s as object', (initial, expected) => {
    expect(deepFindParentByValue(testObject2, initial, true)).toMatchObject(expected);
  });
});
