import {
  deepFreeze,
  camelizeObjectKeys,
  filterObjectKeys,
  deepFindParentByValue
} from '../lib/objects';

describe('deepFreeze', () => {
  it('should freeze object at all levels', () => {
    const object = {
      externalId: 1,
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
      external_id: 1,
      public_profile: {
        personal_no: 111
      }
    };
    const expectedResult = {
      externalId: 1,
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
  it('should return empty object for empty object', () => {
    expect(deepFindParentByValue({}, 1)).toMatchObject({});
  });

  it('should return null for null', () => {
    expect(deepFindParentByValue(null, 1)).toBe(null);
  });

  const obj1 = {
    id: 1,
    attributes: {
      children: ['a', 'b', 'c']
    }
  };
  const obj = {
    data: [
      obj1
    ]
  };

  it.each([
    [1, obj1],
    ['b', ['a', 'b', 'c']]
  ])('should return expected value for %s', (initial, expected) => {
    expect(deepFindParentByValue(obj, initial)).toMatchObject(expected);
  });

  it.each([
    [1, { path: ['data', '0'], data: obj1 }],
    ['b', { path: ['data', '0', 'attributes', 'children'], data: ['a', 'b', 'c'] }]
  ])('should return expected value for %s as object', (initial, expected) => {
    expect(deepFindParentByValue(obj, initial, true)).toMatchObject(expected);
  });
});
