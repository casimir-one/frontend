import Maska from 'maska';
import { proxydi } from '@deip/proxydi';
import { setLocalesMessages } from '@deip/toolbox';

import { callForCurrentUser } from '@deip/platform-fns';
import { assetsStore, balancesStore, currentUserBalancesStore } from './store';

const locales = require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.js$/i);

// eslint-disable-next-line no-unused-vars
const install = (Vue, options = {}) => {
  if (install.installed) return;
  install.installed = true;

  const store = proxydi.get('storeInstance');
  const i18n = proxydi.get('i18nInstance');

  if (i18n) {
    setLocalesMessages(i18n, locales);
  } else {
    throw Error('[AssetsModule]: i18nInstance is not provided');
  }

  if (store) {
    store.registerModule('assets', assetsStore);
    store.registerModule('balances', balancesStore);
    store.registerModule('currentUserBalances', currentUserBalancesStore);

    store.dispatch('assets/getList');
    store.dispatch('balances/getList');

    callForCurrentUser(
      store,
      'currentUserBalances/get',
      'currentUserBalances/clear'
    );
  } else {
    throw Error('[AssetsModule]: storeInstance is not provided');
  }

  Vue.use(Maska);
};

export const AssetsModule = {
  name: 'AssetsModule',
  deps: [
    'EnvModule',
    'ValidationPlugin',
    'VuetifyExtended',
    'AuthModule',
    'UsersModule',
    'TeamsModule'
  ],
  install
};
