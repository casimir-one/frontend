import {
  collectionList,
  collectionOne
} from '@casimir/toolbox';

/**
 * Factory for generating list getter
 * @param {Object} [opts={}]
 * @param {string} [options.storeKey=data]
 * @returns {Function}
 */
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

/**
 * Factory for generating one getter
 * @param {Object} [opts={}]
 * @param {string} [options.selectorKey=_id]
 * @param {string} [options.storeKey=data]
 * @returns {Function}
 */
export const oneGetterFactory = (opts = {}) => {
  const {
    selectorKey = '_id',
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
