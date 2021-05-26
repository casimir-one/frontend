import RecursiveIterator from 'recursive-iterator';
import { cloneDeep } from 'lodash/fp';
import { isFile } from './verification';

export const toBase64 = (url) => fetch(url)
  .then((response) => response.blob())
  .then((blob) => new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result);
    };

    reader.onerror = reject;
    reader.readAsDataURL(blob);
  }));

export const replaceFileWithName = (obj) => {
  const clone = cloneDeep(obj);

  for (const { node, parent, key } of new RecursiveIterator(clone)) {
    if (isFile(node)) {
      parent[key] = node.name;
    }
  }

  return clone;
};

export const extractFilesFromModel = (obj) => { // TODO: fix and make more universal
  const res = [];

  for (const { node, parent } of new RecursiveIterator(obj, 1, true)) {
    const attrId = parent.attributeId || 'xxx';

    if (isFile(node)) {
      res.push([attrId, node, `${attrId}-${node.name}`]);
    }
  }

  return res;
};

export const fileNameFromUrl = (url) => {
  const matches = url.match(/\/([^/?#]+)[^/]*$/);
  if (matches && matches.length > 1) {
    return matches[1];
  }
  return null;
};
