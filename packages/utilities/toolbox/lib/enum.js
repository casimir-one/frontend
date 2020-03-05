import { isObject, addValueToEnum } from './_utils'


function createEnum(items) {
  let _enum = {};

  if (Array.isArray(items)) {
    items.forEach(it => typeof it === 'string' ? addValueToEnum(_enum, it) : addValueToEnum(_enum, it.key, it.value));
  }

  if (isObject(items)) {
    Object.keys(items).forEach(it => typeof it === 'string' && addValueToEnum(_enum, it, items[it]));
  }

  return _enum;
}

export {
  createEnum,
  addValueToEnum
}
