import { makeSingletonInstance } from '@casimir.one/toolbox';

export class Proxydi {
  _registry = {};

  /**
  * Get proxy
  * @param {string} name
  * @returns {*}
*/
  get(name) {
    return this._registry[name];
  }

  /**
  * Register proxy
  * @param {string} name
  * @param {*} value
*/
  register(name, value) {
    this._registry[name] = value;
  }

  /**
  * Batch register
  * @param {Object} registry
*/
  batchRegister(registry) {
    for (const [name, value] of Object.entries(registry)) {
      this.register(name, value);
    }
  }

  /**
  * Remove proxy
  * @param {string} name
*/
  remove(name) {
    delete this._registry[name];
  }

  /**
  * Batch remove
  * @param {Array.<string>} names
*/
  batchRemove(names) {
    for (const name of names) {
      this.remove(name);
    }
  }

  /**
  * Check for proxy
  * @param {string} name
  * @returns {boolean}
*/
  has(name) {
    return !!this._registry[name];
  }

  static getInstance = makeSingletonInstance(() => new Proxydi());
}

/** @type {Proxydi} */
export const proxydi = Proxydi.getInstance();
