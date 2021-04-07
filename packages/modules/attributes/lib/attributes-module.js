import { proxydi } from '@deip/proxydi';
import { attributesStore } from './store';

// eslint-disable-next-line no-unused-vars
const install = (Vue, options = {}) => {
  if (install.installed) return;
  install.installed = true;

  const store = proxydi.get('storeInstance');

  if (store) {
    store.registerModule('attributes', attributesStore);
  } else {
    throw Error('[AttributesModule]: storeInstance is not provided');
  }
};

export const AttributesModule = {
  name: 'AttributesModule',
  deps: [
    'ValidationPlugin',
    'VuetifyExtended',
    'EnvModule'
  ],
  install
};
