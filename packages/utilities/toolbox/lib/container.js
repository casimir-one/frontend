import { Singleton } from './singleton';

class Container extends Singleton {
  _registry = {};

  get(name) {
    return this._config[name];
  }

  register(name, value) {
    this._registry[name] = value;
  }

  remove(name) {
    delete this._registry[name]
  }

  has(name) {
    return !!this._registry[name];
  }

  create(registry) {
    this._registry = {...registry};
  }
}

const container = Container.getInstance();

export { Container, container };
