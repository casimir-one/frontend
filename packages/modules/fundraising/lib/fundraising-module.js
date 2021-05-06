import Maska from 'maska';

import { proxydi } from '@deip/proxydi';
import { setLocalesMessages } from '@deip/toolbox';
import { fundraisingStore } from './store';

const locales = require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.js$/i);

// eslint-disable-next-line no-unused-vars
const install = (Vue, options = {}) => {
  if (install.installed) return;
  install.installed = true;

  const store = proxydi.get('storeInstance');
  const i18n = proxydi.get('i18nInstance');

  if (i18n) {
    setLocalesMessages(i18n, locales);
  }

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
