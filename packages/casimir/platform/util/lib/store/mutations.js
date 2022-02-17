import { collectionMerge } from '@deip/toolbox';

/**
 * Factory for generating mutation for merging list of items into store
 * @param {Object} [opts={}]
 * @param {string} [options.mergeKey=_id]
 * @param {string} [options.storeKey=data]
 * @returns {Function} mutation
 */
export const setListMutationFactory = (opts = {}) => {
  const {
    mergeKey = '_id',
    storeKey = 'data'
  } = opts;

  return (state, payload) => {
    if (!payload) return;

    state[storeKey] = [...collectionMerge(
      state[storeKey],
      payload,
      { key: mergeKey }
    )];
  };
};
export const setListMutation = setListMutationFactory();

/**
 * Factory for generating mutation for merging one item into store
 * @param {Object} [opts={}]
 * @param {string} [options.mergeKey=_id]
 * @param {string} [options.storeKey=data]
 * @returns {Function} mutation
 */
export const setOneMutationFactory = (opts = {}) => {
  const {
    mergeKey = '_id',
    storeKey = 'data'
  } = opts;

  return (state, payload) => {
    if (!payload) return;

    state[storeKey] = collectionMerge(
      state[storeKey],
      payload,
      { key: mergeKey }
    );
  };
};
export const setOneMutation = setOneMutationFactory();

/**
 * Factory for generating mutation for removing item from store
 * @param {Object} [opts={}]
 * @param {string} [options.mergeKey=_id]
 * @param {string} [options.storeKey=data]
 * @returns {Function} mutation
 */
export const removeFromListMutationFactory = (opts = {}) => {
  const {
    mergeKey = '_id',
    storeKey = 'data'
  } = opts;

  return (state, id) => {
    if (!id) return;
    if (!state[storeKey]) throw new Error(`state.${storeKey} is undefined`);

    const index = state[storeKey].findIndex((item) => item[mergeKey] === id);
    if (index > -1) {
      state[storeKey].splice(index, 1);
    }
  };
};
export const removeFromListMutation = removeFromListMutationFactory();

/**
 * Factory for generating mutation for removing all items from store
 * @param {Object} [opts={}]
 * @param {string} [options.storeKey=data]
 * @param {Array} [options.emptyData=[]]
 * @returns {Function} mutation
 */
export const clearMutationFactory = (opts = {}) => {
  const {
    storeKey = 'data',
    emptyData = []
  } = opts;

  return (state) => {
    state[storeKey] = emptyData;
  };
};
export const clearMutation = clearMutationFactory();
