import where from 'filter-where';
import { merge } from 'lodash/fp';

import { isArray } from './verification';

const defaultOpts = { // as object for future extensions
  key: 'id'
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

  const { key } = opts;
  const result = [...col1];

  for (const item of col2) {
    const idx = col1.findIndex((i) => i[key] && item[key] && i[key] === item[key]);
    if (idx >= 0) {
      result[idx] = merge(result[idx], item);
    } else {
      result.push(item);
    }
  }

  return result;
};

export const collectionOne = (collection, query) => collection.find(where(query));
export const collectionList = (collection, query) => collection.filter(where(query));
