import { Singleton } from '@deip/toolbox';

class AppConfigService extends Singleton {
  _config = {
    env: {}
  };

  get(name) {
    return this._config[name];
  }

  set(name, value) {
    this._config[name] = value;
  }

  init(config) {
    this._config = {...config};
  }
}

export { AppConfigService };
