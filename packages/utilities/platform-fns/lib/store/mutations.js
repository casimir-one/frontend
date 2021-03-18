import { camelizeObjectKeys, collectionMerge } from '@deip/toolbox';

export const setListMutationFabric = (opts = {}) => {
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
  }
};
export const setListMutation = setListMutationFabric();

export const setOneMutationFabric = (opts = {}) => {
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
  }
};
export const setOneMutation = setOneMutationFabric()












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
  }
};

export const crudMutations = crudMutationsFabric();
