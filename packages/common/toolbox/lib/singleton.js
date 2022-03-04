class Singleton {
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

export { Singleton };
