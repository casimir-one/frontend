import { collectionMerge } from '@deip/toolbox';

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

export const crudMutationsFactory = (opts = {}) => {
  const {
    dataKey: mergeKey = '_id',
    storeKey = 'data',
    emptyData = []
  } = opts;

  return {
    setList: setListMutationFactory({ mergeKey, storeKey }),
    setOne: setOneMutationFactory({ mergeKey, storeKey }),
    removeFromList: removeFromListMutationFactory({ mergeKey, storeKey }),
    clearList: clearMutationFactory(storeKey, emptyData)
  };
};

export const crudMutations = crudMutationsFactory();
