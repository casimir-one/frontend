export class CreateApp {
  _registeredModules = {}

  _modulesStorage = {}

  constructor(vueInstance) {
    this.Vue = vueInstance;
  }

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
          this.Vue.use(module, options, data);
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

  bootstrap() {
    return Promise.all(
      Object.keys(this._registeredModules)
        .map((module) => this.installModule(module))
    );
  }
}
