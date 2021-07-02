import { proxydi } from '@deip/proxydi';
import { layoutsStore } from './store';

const install = (Vue) => {
  if (install.installed) return;
  install.installed = true;

  const store = proxydi.get('storeInstance');

  if (store) {
    store.registerModule('layouts', layoutsStore);
    store.dispatch('layouts/getList');

    Object.defineProperty(Vue.prototype, '$layouts', {
      get() {
        return {};
      }
    });
  } else {
    throw Error('[LayoutsModule]: storeInstance is not provided');
  }
};

export const LayoutsModule = {
  name: 'LayoutsModule',
  deps: [
    'VuetifyExtended',
    'EnvModule',
    'AttributesModule'
  ],
  install
};
