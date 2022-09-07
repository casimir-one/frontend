import { setLocalesMessages } from '@casimir.one/toolbox';
import { AttributeScope } from '@casimir.one/platform-core';
import { nftItemsStore, nftItemDraftsStore } from './store';
import { nftItemScope } from './config';

const locales = require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.js$/i);

const install = (Vue, options = {}) => {
  if (install.installed) return;
  install.installed = true;

  const {
    store,
    i18n,
    attributesMappedKeys = [],
    layoutsMappedKeys = []
  } = options;

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

  store.dispatch('scopesRegistry/addScope', nftItemScope);

  if (attributesMappedKeys.length) {
    store.dispatch('scopesRegistry/addMappedKeys', {
      scope: AttributeScope.NFT_ITEM,
      target: 'attributes',
      keys: attributesMappedKeys
    });
  }
  if (layoutsMappedKeys.length) {
    store.dispatch('scopesRegistry/addMappedKeys', {
      scope: AttributeScope.NFT_ITEM,
      target: 'layouts',
      keys: layoutsMappedKeys
    });
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
