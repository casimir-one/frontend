import {
  collectionList,
  collectionOne
} from '@deip/toolbox';

export const listGetterFabric = (opts = {}) => {
  const {
    storeKey = 'data'
  } = opts;

  return (state) => (query = {}) => collectionList(state[storeKey], query);
}
export const listGetter = listGetterFabric();

export const oneGetterFabric = (opts = {}) => {
  const {
    selectorKey = 'externalId',
    storeKey = 'data'
  } = opts;

  return (state) => (itemId, query = {}) => {
    if (!itemId) {
      throw new Error(`${selectorKey} id not specified`);
    }

    return collectionOne(state[storeKey], {
      [selectorKey]: itemId,
      ...query
    })
  }
}
export const oneGetter = oneGetterFabric();
