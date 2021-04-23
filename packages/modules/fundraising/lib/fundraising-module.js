import Maska from 'maska';

import { proxydi } from '@deip/proxydi';
import { fundraisingStore } from './store';

// eslint-disable-next-line no-unused-vars
const install = (Vue, options = {}) => {
  if (install.installed) return;
  install.installed = true;

  const store = proxydi.get('storeInstance');

  if (store) {
    store.registerModule('fundraising', fundraisingStore);
  } else {
    throw Error('[FundraisingModule]: storeInstance is not provided');
  }

  Vue.use(Maska);
};

export const FundraisingModule = {
  name: 'FundraisingModule',
  deps: [
    'EnvModule',
    'ValidationPlugin',
    'VuetifyExtended',
    'AssetsModule'
  ],
  install
};
