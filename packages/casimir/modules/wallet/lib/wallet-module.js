import { setLocalesMessages } from '@deip/toolbox';

import { callForCurrentUser } from '@deip/platform-store';
import { walletStore } from './store';

const locales = require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.js$/i);

// eslint-disable-next-line no-unused-vars
const install = (Vue, options = {}) => {
  if (install.installed) return;
  install.installed = true;

  const { store, i18n } = options;

  if (i18n) {
    setLocalesMessages(i18n, locales);
  } else {
    throw Error('[WalletModule]: i18nInstance is not provided');
  }

  if (store) {
    store.registerModule('wallet', walletStore);

    callForCurrentUser(
      store,
      'wallet/get',
      'wallet/clear'
    );
  } else {
    throw Error('[WalletModule]: storeInstance is not provided');
  }
};

export const WalletModule = {
  name: 'WalletModule',
  deps: [
    'EnvModule',
    'AuthModule',
    'VuetifyExtended',
    'ValidationPlugin',
    'AssetsModule'
  ],
  install
};
