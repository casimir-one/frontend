import { Singleton } from '@deip/toolbox';
import { proxydi } from '@deip/proxydi';

class AppConfigService extends Singleton {
  proxydi = proxydi;

  get(name) {
    return this.proxydi.get(name);
  }

  set(name, value) {
    this.proxydi.register(name, value)
  }

  init(config) {
    this.proxydi.batchRegister(config)
  }
}

export { AppConfigService };
