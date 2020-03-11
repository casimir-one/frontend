class Singleton {
  static instance;

  static getInstance(...params) {
    return this.instance ? this.instance : this.instance = new this(...params);
  }
}

export { Singleton };
