const INSTANCE = Symbol('class-singleton:instance');

export class ClassSingletonError extends Error {
  constructor(msg = '') {
    super(msg);
    this.name = 'ClassSingletonError';
  }
}

/**
 * Make singleton with arguments
 * @template T
 * @param {function} Class
 * @param {any} args
 * @example```js
 * // in the class body create static variable
 * const singleton = classSingleton(SomeClass, 'arg1', 'arg2');
 * ```
 * @returns {T}
 */
export const classSingleton = (Class, ...args) => {
  if (typeof Class === 'undefined') {
    throw new ClassSingletonError('argument "Class" is required');
  }
  if (typeof Class !== 'function' && !/^class.*?{/.test(Class.toString())) {
    throw new ClassSingletonError('argument "Class" is not a constructor');
  }
  const isExists = Class[INSTANCE] instanceof Class;
  // eslint-disable-next-line no-param-reassign
  if (!isExists) Class[INSTANCE] = new Class(...args);
  return Class[INSTANCE];
};

/**
 * Creates method for simplify make class singleton
 * @template T
 * @param {function} Class
 * @example```js
 * // in the class body create static variable
 * // jsDoc: @type () => SomeClass
 * static getInstance = createInstanceGetter(SomeClass);
 * // in the som other code
 * SomeClass.getInstance('arg1', 'arg2');
 * ```
 * @returns {(...any) => T}
 */
export const createInstanceGetter = (Class) => (...args) => classSingleton(Class, ...args);
