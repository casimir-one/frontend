import { isNil } from 'lodash';
import crypto from '@deip/lib-crypto';
import md5 from 'md5';
import {
  isArray,
  isObject
} from './validation';

export const genSha256Hash = (val) => {
  if (isNil(val)) return undefined;

  let string = val;

  if (isObject(val) || isArray(val)) {
    string = JSON.stringify(val);
  }

  return crypto.hexify(crypto.sha256(new TextEncoder('utf-8').encode(string).buffer));
};

export const genRipemd160Hash = (val) => {
  if (isNil(val)) return undefined;

  let string = val;

  if (isObject(val) || isArray(val)) {
    string = JSON.stringify(val);
  }

  return crypto.hexify(crypto.ripemd160(new TextEncoder('utf-8').encode(string).buffer));
};

export const genMd5Hash = (val) => {
  if (isNil(val)) return undefined;

  let string = val;

  if (isObject(val) || isArray(val)) {
    string = JSON.stringify(val);
  }

  return md5(string);
};
