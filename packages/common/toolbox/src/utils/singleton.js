export class Singleton {
  static instance;
  /**
   * Get the Singleton instance.
   * @param {...any} params
   * @returns {Singleton}
   */
  static getInstance(...params) {
    // eslint-disable-next-line no-return-assign
    return this.instance ? this.instance : this.instance = new this(...params);
  }
}

/**
 * @return {{load: (function(*): *), store: store}}
 */
function makeSingletonStorage() {
  const storage = {};
  return {
    load: (key) => storage[key],
    store: (key, value) => { storage[key] = value; }
  };
}

/**
 * @param createInstance
 * @return {function(...[*]): *}
 */
export function makeSingletonInstance(createInstance) {
  let storage;

  return (...args) => {
    if (!storage) {
      storage = makeSingletonStorage();
    }

    const key = JSON.stringify(args);

    let instance = storage.load(key);

    if (!instance) {
      instance = createInstance(...args);
      storage.store(key, instance);
    }
    return instance;
  };
}

// export class SingletonDemo {
//   constructor(userId) { console.log(userId); }
//
//   static getInstance = makeSingletonInstance((userId) => new SingletonDemo(userId));
// }
