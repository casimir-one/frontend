import RecursiveIterator from 'recursive-iterator';
import { cloneDeep } from 'lodash';
import { isFile } from './validation';

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

  for (const { node, parent, key } of new RecursiveIterator(clone, 1, true)) {
    if (isFile(node)) {
      parent[key] = node.name;
    }
  }

  return clone;
};

export const extractFilesFromModel = (obj) => { // TODO: fix and make more universal
  const res = [];

  for (const { node, key, parent } of new RecursiveIterator(obj, 1, true)) {
    const attrId = parent.attributeId;
    if (isFile(node)) {
      if (attrId) {
        res.push([attrId, node, `${attrId}-${node.name}`]);
      } else {
        res.push([key, node]);
      }
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
