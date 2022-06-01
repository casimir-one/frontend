export class BuildStack {
  #registeredPackages = {}

  #packagesStorage = {}

  #builder

  /**
   * @param {Function} builder
   */
  constructor(builder) {
    this.#builder = builder;
  }

  /**
   * @param name
   * @return {*}
   */
  #compilePackage(name) {
    if (this.#packagesStorage[name]) {
      return this.#packagesStorage[name];
    }

    const { deps } = this.#registeredPackages[name];
    const compileDeps = deps.filter((d) => Object.keys(this.#registeredPackages).includes(d));

    this.#packagesStorage[name] = (
      compileDeps.length === 0
        ? Promise.resolve()
        : Promise.all(compileDeps.map((dep) => this.#compilePackage(dep)))
    )
      .then(() => this.#builder(this.#registeredPackages[name]));

    return this.#packagesStorage[name];
  }

  /**
   * @param module
   * @return {BuildStack}
   */
  addPackage(module) {
    const { name } = module;

    if (!name) {
      throw Error('Module name not provided');
    }

    this.#registeredPackages[name] = module;

    return this;
  }

  /**
   * @return {Promise<void>}
   */
  async compile() {
    await Promise.all(
      Object.keys(this.#registeredPackages)
        .map((module) => this.#compilePackage(module))
    );

    return Promise.resolve();
  }
}
