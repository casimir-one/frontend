const INSTANCE = Symbol('singleton-decorator:instance');

function getInstance(Class, ...args) {
  // eslint-disable-next-line no-return-assign,no-param-reassign
  return Class[INSTANCE] = Class[INSTANCE] instanceof Class ? Class[INSTANCE] : new Class(...args);
}

/**
 * @template T
 * @param Class
 * @returns {T & { getInstance(): T }}
 */
export function singletonDecorator(Class) {
  const partiallyGetInstance = getInstance.bind(null, Class);
  Object.defineProperty(Class, 'getInstance', {
    value: partiallyGetInstance
  });
  return partiallyGetInstance;
}
