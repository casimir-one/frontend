import { assert, setLocalesMessages } from '@deip/toolbox';

import { nftCollectionsStore } from './store';
import { nftCollectionsScope } from './config';

const locales = require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.js$/i);
const moduleName = 'NftCollectionsModule';

// eslint-disable-next-line no-unused-vars
const install = (Vue, options = {}) => {
  if (install.installed) return;
  install.installed = true;

  const {
    store,
    i18n,
    attributesMappedKeys = [],
    layoutsMappedKeys = []
  } = options;

  assert(!!store, `[${moduleName}]: store instance is not provided`);
  assert(!!i18n, `[${moduleName}]: i18n instance is not provided`);

  setLocalesMessages(i18n, locales);
  store.registerModule('nftCollections', nftCollectionsStore);

  store.dispatch('scopesRegistry/addScope', nftCollectionsScope);

  if (attributesMappedKeys.length) {
    store.dispatch('scopesRegistry/addMappedKeys', {
      scope: 'nftCollection',
      target: 'attributes',
      keys: attributesMappedKeys
    });
  }

  if (layoutsMappedKeys.length) {
    store.dispatch('scopesRegistry/addMappedKeys', {
      scope: 'nftCollection',
      target: 'layouts',
      keys: layoutsMappedKeys
    });
  }
};

export const NftCollectionsModule = {
  name: moduleName,
  deps: [
    'ValidationPlugin',
    'VuetifyExtended',

    'EnvModule',
    'ScopesModule',
    'AttributesModule',
    'LayoutsModule',

    'AuthModule',
    'UsersModule'
  ],
  install
};
