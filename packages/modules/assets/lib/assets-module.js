import { proxydi } from '@deip/proxydi';
import { assetsStore, balancesStore, currentUserBalancesStore } from './store';

// eslint-disable-next-line no-unused-vars
const install = (Vue, options = {}) => {
  if (install.installed) return;
  install.installed = true;

  const store = proxydi.get('storeInstance');

  if (store) {
    store.registerModule('assets', assetsStore);
    store.registerModule('balances', balancesStore);
    store.registerModule('currentUserBalances', currentUserBalancesStore);
  } else {
    throw Error('[AssetsModule]: storeInstance is not provided');
  }
};

export const AssetsModule = {
  name: 'AssetsModule',
  deps: [
    'EnvModule',
    'ValidationPlugin',
    'VuetifyExtended',
    'UsersModule'
  ],
  install
};
