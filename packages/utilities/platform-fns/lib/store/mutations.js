import { camelizeObjectKeys, collectionMerge } from '@deip/toolbox';

export const setListMutationFactory = (opts = {}) => {
  const {
    mergeKey = 'externalId',
    storeKey = 'data'
  } = opts;

  return (state, payload) => {
    if (!payload) return;

    state[storeKey] = collectionMerge(
      state[storeKey],
      payload.map((asset) => camelizeObjectKeys(asset)),
      { key: mergeKey }
    );
  };
};
export const setListMutation = setListMutationFactory();

export const setOneMutationFactory = (opts = {}) => {
  const {
    mergeKey = 'externalId',
    storeKey = 'data'
  } = opts;

  return (state, payload) => {
    if (!payload) return;

    state[storeKey] = collectionMerge(
      state[storeKey],
      camelizeObjectKeys(payload),
      { key: mergeKey }
    );
  };
};
export const setOneMutation = setOneMutationFactory();

export const removeFromListMutationFactory = (opts = {}) => {
  const {
    mergeKey = 'externalId',
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

/// experimental
export const crudMutationsFabric = (opts = {}) => {
  const { collectionMergeKey = 'externalId' } = opts;

  return {
    setList(state, payload) {
      if (!payload) return;

      state.data = collectionMerge(
        state.data,
        payload.map((asset) => camelizeObjectKeys(asset)),
        { key: collectionMergeKey }
      );
    },

    setOne(state, payload) {
      if (!payload) return;

      state.data = collectionMerge(
        state.data,
        camelizeObjectKeys(payload),
        { key: collectionMergeKey }
      );
    }
  };
};

export const crudMutations = crudMutationsFabric();
