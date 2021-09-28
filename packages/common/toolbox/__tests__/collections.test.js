import {
  wrapInArray,
  collectionMerge,
  collectionOne,
  collectionList
} from '../lib/collections';

describe('wrapInArray', () => {
  it('should return empty array', () => {
    expect(wrapInArray(null)).toEqual([]);
  });

  it('should return initial array', () => {
    const initialArray = [1, 2, 3];
    expect(wrapInArray(initialArray)).toEqual(initialArray);
  });

  it('it should wrap value in array', () => {
    const initialValue = 'hello';
    expect(wrapInArray(initialValue)).toEqual([initialValue]);
  });
});

describe('collectionMerge', () => {
  it('should merge collections when items are not objects', () => {
    const col1 = [1, 2, 3];
    const col2 = [4, 5];
    expect(collectionMerge(col1, col2)).toEqual([1, 2, 3, 4, 5]);
  });

  it('should merge collections when target array contains not objects', () => {
    const col1 = [{ id: 1 }];
    const col2 = [2];
    expect(collectionMerge(col1, col2)).toEqual([{ id: 1 }, 2]);
  });

  it('should merge collections when source array contains not objects', () => {
    const col1 = [1];
    const col2 = [{ id: 2 }];
    expect(collectionMerge(col1, col2)).toEqual([1, { id: 2 }]);
  });

  it('should merge collections when key is defined in options', () => {
    const col1 = [
      { id: 1 },
      {
        id: 2,
        location: {
          country: 'USA',
          city: 'New-York'
        }
      }];
    const col2 = [
      { id: 1, name: 'Hello' },
      {
        id: 2,
        location: {
          country: 'Poland',
          city: 'Warsaw'
        }
      }];
    const expectedResult = [
      { id: 1, name: 'Hello' },
      {
        id: 2,
        location: {
          country: 'Poland',
          city: 'Warsaw'
        }
      }];

    expect(collectionMerge(col1, col2)).toEqual(expectedResult);
  });

  it('should merge collections when key is defined in options', () => {
    const col1 = [{ externalId: 1 }, { externalId: 2 }];
    const col2 = [{ externalId: 2, name: 'Hello' }];
    const expectedResult = [{ externalId: 1 }, { externalId: 2, name: 'Hello' }];
    expect(collectionMerge(col1, col2, { key: 'externalId' })).toEqual(expectedResult);
  });
});

describe('collectionOne', () => {
  it('should return one object', () => {
    const expectedResult = { id: 1, name: 'hello' };
    const collection = [expectedResult, { id: 2, name: 'world' }];
    expect(collectionOne(collection, { id: 1 })).toEqual(expectedResult);
  });

  it('should return undefined', () => {
    const collection = [{ id: 1, name: 'hello' }, { id: 2, name: 'world' }];
    expect(collectionOne(collection, { id: 3 })).toBeUndefined();
  });
});

describe('collectionList', () => {
  it('should return found items', () => {
    const expectedResult = [{ id: 1, name: 'hello' }, { id: 2, name: 'hello' }];
    const collection = [...expectedResult, { id: 3, name: '!!!' }];
    expect(collectionList(collection, { name: 'hello' })).toEqual(expectedResult);
  });

  it('should return empty list', () => {
    const collection = [{ id: 1, name: 'hello' }, { id: 2, name: 'world' }];
    expect(collectionList(collection, { name: '!!!' })).toEqual([]);
  });
});
