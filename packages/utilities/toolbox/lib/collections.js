import where from 'filter-where';
import { merge } from 'lodash-es';

import { isArray } from './validation';

const defaultOpts = { // as object for future extensions
  key: 'id',
  mergeItem: false
};

export const wrapInArray = (v) => {
  if (!v) return [];
  return isArray(v) ? v : [v];
};

export const collectionMerge = (
  c1 = [],
  c2 = [],
  opts = defaultOpts
) => {
  const col1 = wrapInArray(c1);
  const col2 = wrapInArray(c2);

  const { key, mergeItem } = opts;
  const result = [...col1];

  for (const item of col2) {
    const idx = col1.findIndex((i) => i[key] && item[key] && i[key] === item[key]);
    if (idx >= 0) {
      result[idx] = mergeItem ? merge(result[idx], item) : item;
    } else {
      result.push(item);
    }
  }

  return result;
};

export const collectionOne = (collection, query) => collection.find(where(query));
export const collectionList = (collection, query) => collection.filter(where(query));
