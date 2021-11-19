import { proxydi } from '@deip/proxydi';
import { createInstanceGetter } from '@deip/toolbox';

/**
 * @deprecated
 */
export class AppConfigService {
  proxydi = proxydi;

  get(name) {
    return this.proxydi.get(name);
  }

  set(name, value) {
    this.proxydi.register(name, value);
  }

  init(config) {
    this.proxydi.batchRegister(config);
  }

  /** @type {() => AppConfigService} */
  static getInstance = createInstanceGetter(AppConfigService)
}
