import { isObject } from './verification'

export function addValueToEnum(_enum, key, value) {
  if (typeof value === 'undefined') {
    value = Math.max.apply(
      null,
      [...Object.values(_enum).map((it) => +it).filter((it) => !isNaN(it)), -1]) + 1;
  }

  if (Number.isNaN(value)) {
    _enum[key] = value;
  } else {
    _enum[_enum[key] = value] = key;
  }
}


export function createEnum(items) {
  let _enum = {};

  if (Array.isArray(items)) {
    items.forEach(it => typeof it === 'string' ? addValueToEnum(_enum, it) : addValueToEnum(_enum, it.key, it.value));
  }

  if (isObject(items)) {
    Object.keys(items).forEach(it => typeof it === 'string' && addValueToEnum(_enum, it, items[it]));
  }

  return _enum;
}
