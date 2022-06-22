import { setLocalesMessages } from '@deip/toolbox';
import { nftItemsStore, nftItemDraftsStore } from './store';

const locales = require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.js$/i);

const install = (Vue, options = {}) => {
  if (install.installed) return;
  install.installed = true;

  const { store, i18n } = options;

  if (i18n) {
    setLocalesMessages(i18n, locales);
  } else {
    throw Error('[NftItemsModule]: i18nInstance is not provided');
  }

  if (store) {
    store.registerModule('nftItems', nftItemsStore);
    store.registerModule('nftItemDrafts', nftItemDraftsStore);
  } else {
    throw Error('[nftItemsModule]: storeInstance is not provided');
  }
};

export const NftItemsModule = {
  name: 'NftItemsModule',
  deps: [
    'EnvModule',
    'AuthModule',
    'UsersModule',
    'NftCollectionsModule'
  ],
  install
};
