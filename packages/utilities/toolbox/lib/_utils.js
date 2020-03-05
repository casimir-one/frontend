const isObject = (obj) => {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

function addValueToEnum(_enum, key, value) {
  if (typeof value === 'undefined') {
    value = Math.max.apply(null, [...Object.values(_enum).map(it => +it).filter(it => !isNaN(it)), -1]) + 1;
  }

  if (Number.isNaN(value)) {
    _enum[key] = value;
  } else {
    _enum[_enum[key] = value] = key;
  }
}

const deepFreeze = (obj) => {
  let propsNames = Object.getOwnPropertyNames(obj)
  propsNames.forEach(function(name) {
    let prop = obj[name]

    if (isObject(prop) && prop !== null) {
      deepFreeze(prop)
    }
  });
  return Object.freeze(obj)
}

export {
  isObject,
  deepFreeze,
  addValueToEnum
}
