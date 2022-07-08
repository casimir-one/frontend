import md5 from 'md5';
import { sha256 } from '@noble/hashes/sha256';
import { ripemd160 } from '@noble/hashes/ripemd160';

import {
  isArray,
  isObject,
  isNil
} from '../verification';

/**
 * @param data
 * @return {string}
 */
function hexify(data) {
  let result = '';
  const view = new Uint8Array(data);
  for (let i = 0; i < view.byteLength; i++) {
    if (view[i] < 16) {
      result += '0';
    }
    result += view[i].toString(16);
  }
  return result;
}

/**
  * Generate sha256 hash
  * @param {*} val
  * @returns {string}
*/
export const genSha256Hash = (val) => {
  if (isNil(val)) return undefined;

  let string = val;

  if (isObject(val) || isArray(val)) {
    string = JSON.stringify(val);
  }

  return hexify(sha256(string));
};

/**
  * Generate ripemd160 hash
  * @param {*} val
  * @returns {string}
*/
export const genRipemd160Hash = (val) => {
  if (isNil(val)) return undefined;

  let string = val;

  if (isObject(val) || isArray(val)) {
    string = JSON.stringify(val);
  }

  return hexify(ripemd160(string));
};

/**
  * Generate md5 hash
  * @param {*} val
  * @returns {string}
*/
export const genMd5Hash = (val) => {
  if (isNil(val)) return undefined;

  let string = val;

  if (isObject(val) || isArray(val)) {
    string = JSON.stringify(val);
  }

  return md5(string);
};
