import Maska from 'maska';
import { setLocalesMessages } from '@casimir.one/toolbox';

import { assetAttributes, components } from './config';

import { assetsStore, balancesStore } from './store';

const locales = require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.js$/i);

// eslint-disable-next-line no-unused-vars
const install = (Vue, options = {}) => {
  const { withBalances = true } = options;
  if (install.installed) return;
  install.installed = true;

  const { store, i18n } = options;

  if (i18n) {
    setLocalesMessages(i18n, locales);
  } else {
    throw Error('[AssetsModule]: i18nInstance is not provided');
  }

  if (store) {
    store.registerModule('assets', assetsStore);
    store.registerModule('balances', balancesStore);

    store.dispatch('assets/getList')
      .then(() => {
        if (withBalances) {
          store.dispatch('balances/getList', { withAssetsFetch: false });
        }
      });
  } else {
    throw Error('[AssetsModule]: storeInstance is not provided');
  }

  for (const attribute of assetAttributes) {
    store.dispatch('attributesRegistry/addAttribute', attribute);
  }

  store.commit('layoutsRegistry/addComponents', components);

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
