import {
  listGetter,
  listGetterFactory,
  oneGetter,
  oneGetterFactory
} from '../lib/store';

const state = {
  data: [
    {
      id: 1,
      _id: 'a'
    }, {
      id: 2,
      _id: 'b'
    }
  ]
};
const expectedObject = { id: 1, _id: 'a' };

describe('listGetter', () => {
  it('should return all objects', () => {
    const result = listGetter(state)();
    expect(result).toEqual(state.data);
  });

  it('should return filtered array', () => {
    const result = listGetter(state)({ id: 1 });
    expect(result).toEqual([expectedObject]);
  });

  it('should return empty', () => {
    const result = listGetter(state)({ id: 3 });
    expect(result).toEqual([]);
  });
});

describe('listGetterFactory', () => {
  it('should throw error', () => {
    expect(() => {
      listGetterFactory({ storeKey: 'objects' })(state)();
    }).toThrow();
  });

  it('should return all objects', () => {
    const result = listGetterFactory({ storeKey: 'data' })(state)();
    expect(result).toEqual(state.data);
  });

  it('should return filtered array', () => {
    const result = listGetterFactory({ storeKey: 'data' })(state)({ id: 1 });
    expect(result).toEqual([expectedObject]);
  });

  it('should return empty', () => {
    const result = listGetterFactory({ storeKey: 'data' })(state)({ id: 3 });
    expect(result).toEqual([]);
  });
});

describe('oneGetter', () => {
  it('should throw error', () => {
    expect(() => {
      oneGetter(state)();
    }).toThrow();
  });

  it('should return object', () => {
    const result = oneGetter(state)('a');
    expect(result).toEqual(expectedObject);
  });

  it('should return undefined', () => {
    const result = oneGetter(state)('c');
    expect(result).toBeUndefined();
  });

  it('should return object', () => {
    const result = oneGetter({
      data: [
        {
          _id: { a: 'a', b: 'b' }
        }, {
          _id: { a: 'c', b: 'c' }
        }
      ]
    })({ a: 'a', b: 'b' });
    expect(result).toEqual({
      _id: { a: 'a', b: 'b' }
    });
  });

  it('should return object', () => {
    const result = oneGetter({
      data: [
        {
          _id: { _id: 'a' }
        }, {
          _id: { _id: 'c' }
        }
      ]
    })({ _id: 'c' });
    expect(result).toEqual({
      _id: { _id: 'c' }
    });
  });
});

describe('oneGetterFactory', () => {
  it('should throw error', () => {
    expect(() => {
      oneGetterFactory({ storeKey: 'objects' })(state)();
    }).toThrow();
    expect(() => {
      oneGetterFactory()(state)();
    }).toThrow();
  });

  it('should return object', () => {
    const result = oneGetterFactory({ storeKey: 'data', selectorKey: 'id' })(state)(1);
    expect(result).toEqual(expectedObject);
  });

  it('should return object', () => {
    const result = oneGetterFactory({ storeKey: 'data', selectorKey: 'team' })({
      data: [
        {
          team: { _id: 'a' }
        }, {
          team: { _id: 'b' }
        }
      ]
    })({ _id: 'b' });
    expect(result).toEqual({
      team: { _id: 'b' }
    });
  });

  it('should return undefined', () => {
    const result = oneGetterFactory({ storeKey: 'data', selectorKey: 'id' })(state)(10);
    expect(result).toBeUndefined();
  });
});
