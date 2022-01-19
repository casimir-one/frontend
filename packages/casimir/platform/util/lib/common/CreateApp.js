export class CreateApp {
  _registeredModules = {}

  _modulesStorage = {}

  /**
   * @param {*} vueInstance
   * @param {Object} provideOptions
   */
  constructor(vueInstance, provideOptions = {}) {
    this.Vue = vueInstance;
    this.provideOptions = provideOptions;
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

    this._registeredModules[name] = {
      module,
      options
    };

    return this;
  }

  /**
   * @param {string} name
   * @return {Promise|Function}
   */
  installModule(name) {
    if (this._modulesStorage[name]) {
      return this._modulesStorage[name];
    }

    const { deps = [] } = this._registeredModules[name].module;

    if (!deps.every((dep) => this._registeredModules[dep])) {
      const missed = deps.filter((dep) => !this._registeredModules[dep]);
      throw Error(`[${missed.join(', ')}] deps missed for ${name}`);
    }

    const useFn = () => {
      const {
        module,
        options
      } = this._registeredModules[name];

      return (
        module.init
          ? module.init()
          : Promise.resolve())

        .then((data) => {
          const mergedOpts = {
            ...(options.provideOptions !== false ? this.provideOptions : {}),
            ...options
          };
          this.Vue.use(module, mergedOpts, data);
        });
    };

    this._modulesStorage[name] = (
      deps.length === 0
        ? Promise.resolve()
        : Promise.all(deps.map((dep) => this.installModule(dep)))
    )
      .then(useFn);

    return this._modulesStorage[name];
  }

  /**
   * @return {Array.<Promise>}
   */
  bootstrap() {
    return Promise.all(
      Object.keys(this._registeredModules)
        .map((module) => this.installModule(module))
    );
  }
}
