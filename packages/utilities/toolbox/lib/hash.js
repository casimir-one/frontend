import { isNil } from 'lodash-es';
import crypto from '@deip/lib-crypto';
import {
  isArray,
  isObject
} from './validation';

export const createHash = (val) => {
  if (isNil(val)) return undefined;

  let string = val;

  if (isObject(val) || isArray(val)) {
    string = JSON.stringify(val);
  }

  return crypto.hexify(crypto.sha256(new TextEncoder('utf-8').encode(string).buffer));
};
