import {
  collectionList,
  collectionOne
} from '@deip/toolbox';

export const listGetterFactory = (opts = {}) => {
  const {
    storeKey = 'data'
  } = opts;

  return (state) => (query = {}) => {
    if (!state[storeKey]) {
      throw new Error(`state.${storeKey} is undefined`);
    }

    return collectionList(state[storeKey], query);
  };
};
export const listGetter = listGetterFactory();

export const oneGetterFactory = (opts = {}) => {
  const {
    selectorKey = 'externalId',
    storeKey = 'data'
  } = opts;

  return (state) => (itemId, query = {}) => {
    if (!itemId) {
      throw new Error(`${selectorKey} id not specified`);
    }
    if (!state[storeKey]) {
      throw new Error(`state.${storeKey} is undefined`);
    }

    return collectionOne(state[storeKey], {
      [selectorKey]: itemId,
      ...query
    });
  };
};
export const oneGetter = oneGetterFactory();

export const crudGettersFactory = (opts = {}) => {
  const {
    dataKey: selectorKey = 'externalId',
    storeKey = 'data'
  } = opts;

  return {
    list: listGetter,
    one: oneGetterFactory({ selectorKey, storeKey })
  };
};

export const crudGetters = crudGettersFactory();
