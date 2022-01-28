import { assert } from '@deip/toolbox';
import { usersStore } from './store';

import { userScope, userAttributes } from './config';

const moduleName = 'UsersModule';

const install = (Vue, options = {}) => {
  if (install.installed) return;
  install.installed = true;

  if (!Vue.prototype.$deipModules) Vue.prototype.$deipModules = [];
  Vue.prototype.$deipModules.push(moduleName);

  const {
    store,
    attributesMappedKeys = [],
    layoutsMappedKeys = []
  } = options;

  assert(!!store, `[${moduleName}]: store instance is not provided`);

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
