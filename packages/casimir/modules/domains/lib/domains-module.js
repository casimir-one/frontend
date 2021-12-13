import { proxydi } from '@deip/proxydi';
import { domainsStore } from './store';

// eslint-disable-next-line no-unused-vars
const install = (Vue, options = {}) => {
  if (install.installed) return;
  install.installed = true;

  const store = proxydi.get('storeInstance');

  if (store) {
    store.registerModule('domains', domainsStore);
  } else {
    throw Error('[DomainsModule]: storeInstance is not provided');
  }
};

export const DomainsModule = {
  name: 'DomainsModule',
  deps: [
    'EnvModule',
    'ValidationPlugin',
    'VuetifyExtended'
  ],
  install
};
