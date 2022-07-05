import md5 from 'md5';
import crypto from '@deip/lib-crypto';
import {
  isArray,
  isObject,
  isNil
} from '../verification';

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

  return crypto.hexify(crypto.sha256(new TextEncoder('utf-8').encode(string).buffer));
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

  return crypto.hexify(crypto.ripemd160(new TextEncoder('utf-8').encode(string).buffer));
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
