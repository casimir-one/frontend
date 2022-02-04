import { assert, setLocalesMessages } from '@deip/toolbox';
import { usersStore } from './store';

import { userScope, userAttributes } from './config';

const locales = require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.js$/i);
const moduleName = 'UsersModule';

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

  store.registerModule('users', usersStore);
  store.dispatch('scopesRegistry/addScope', userScope);

  if (attributesMappedKeys.length) {
    store.dispatch('scopesRegistry/addMappedKeys', {
      scope: 'user',
      target: 'attributes',
      keys: attributesMappedKeys
    });
  }

  if (layoutsMappedKeys.length) {
    store.dispatch('scopesRegistry/addMappedKeys', {
      scope: 'user',
      target: 'layouts',
      keys: layoutsMappedKeys
    });
  }

  for (const attribute of userAttributes) {
    store.dispatch('attributesRegistry/addAttribute', attribute);
  }
};

export const UsersModule = {
  name: moduleName,
  deps: [
    'ValidationPlugin',
    'VuetifyExtended',

    'EnvModule',
    'ScopesModule',
    'AttributesModule',
    'LayoutsModule',

    'AuthModule'
  ],
  install
};
