import RecursiveIterator from 'recursive-iterator';
import { cloneDeep } from 'lodash';
import { isFile } from '../verification';

/**
  * Convert URL to Base64
  * @param {string} url
  * @returns {Promise.<string>}
*/
export const toBase64 = url => fetch(url).then(response => response.blob()).then(blob => new Promise((resolve, reject) => {
  const reader = new FileReader();

  reader.onload = () => {
    resolve(reader.result);
  };

  reader.onerror = reject;
  reader.readAsDataURL(blob);
}));

/**
  * Replace file with name
  * @param {Object|Array} obj
  * @returns {Object|Array}
*/
export const replaceFileWithName = obj => {
  const clone = cloneDeep(obj);

  for (const {
    node,
    parent,
    key
  } of new RecursiveIterator(clone, 1, true)) {
    if (isFile(node)) {
      parent[key] = node.name;
    }
  }

  return clone;
};

/**
  * Extract files from model
  * @param {Object|Array} obj
  * @returns {Array.<Array>}
*/
export const extractFilesFromModel = obj => {
  // TODO: fix and make more universal
  const res = [];

  for (const {
    node,
    key,
    parent
  } of new RecursiveIterator(obj, 1, true)) {
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

/**
  * Get file name from url
  * @param {string} url
  * @returns {string}
*/
export const fileNameFromUrl = url => {
  const matches = url.match(/\/([^/?#]+)[^/]*$/);

  if (matches && matches.length > 1) {
    return matches[1];
  }

  return null;
};