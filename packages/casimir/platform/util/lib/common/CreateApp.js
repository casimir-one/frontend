export class CreateApp {
  #registeredModules = {}

  #modulesStorage = {}

  /**
   * @param {*} vueInstance
   * @param {Object} provideOptions
   */
  constructor(vueInstance, provideOptions = {}) {
    this.Vue = vueInstance;
    this.provideOptions = provideOptions;
  }

  /**
   * @param {string} name
   * @return {Promise|Function}
   */
  #installModule(name) {
    if (this.#modulesStorage[name]) {
      return this.#modulesStorage[name];
    }

    const { deps = [] } = this.#registeredModules[name].module;

    if (!deps.every((dep) => this.#registeredModules[dep])) {
      const missed = deps.filter((dep) => !this.#registeredModules[dep]);
      throw Error(`[${missed.join(', ')}] deps missed for ${name}`);
    }

    const useFn = () => {
      const {
        module,
        options
      } = this.#registeredModules[name];

      const {
        injectOptions = true
      } = options;

      return (
        module.init
          ? module.init()
          : Promise.resolve()
      ).then((data) => {
        const mergedOpts = {
          ...(injectOptions ? this.provideOptions : {}),
          ...options
        };
        this.Vue.use(module, mergedOpts, data);
      });
    };

    this.#modulesStorage[name] = (
      deps.length === 0
        ? Promise.resolve()
        : Promise.all(deps.map((dep) => this.#installModule(dep)))
    )
      .then(useFn);

    return this.#modulesStorage[name];
  }

  /**
   * @param {Object} module
   * @param {Object} options
   * @return {CreateApp}
   */
  addModule(module, options = {}) {
    const { name } = module;

    if (!name) {
      throw Error('Module name not provided');
    }

    this.#registeredModules[name] = {
      module,
      options
    };

    return this;
  }

  /**
   * @return {Array.<Promise>}
   */
  async bootstrap() {
    await Promise.all(
      Object.keys(this.#registeredModules)
        .map((module) => this.#installModule(module))
    );

    const installed = Object.keys(this.#registeredModules).sort();

    this.Vue.prototype.$casimirModules = installed;

    return installed;
  }
}
