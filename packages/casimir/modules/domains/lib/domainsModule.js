import { domainsStore } from './store';

// eslint-disable-next-line no-unused-vars
const install = (Vue, options = {}) => {
  if (install.installed) return;
  install.installed = true;

  const { store } = options;

  if (store) {
    store.registerModule('domains', domainsStore);
    store.dispatch('domains/getList');
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
