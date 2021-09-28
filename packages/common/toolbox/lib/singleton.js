class Singleton {
  static instance;

  static getInstance(...params) {
    // eslint-disable-next-line no-return-assign
    return this.instance ? this.instance : this.instance = new this(...params);
  }
}

export { Singleton };
