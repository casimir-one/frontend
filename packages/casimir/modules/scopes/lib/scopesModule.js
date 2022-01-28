import { assert } from '@deip/toolbox';
import { scopesRegistry } from './store';

const moduleName = 'ScopesModule';

const install = (Vue, options = {}) => {
  if (install.installed) return;
  install.installed = true;

  const { store, scopes = [] } = options;

  assert(!!store, `[${moduleName}]: store instance is not provided`);

  store.registerModule('scopesRegistry', scopesRegistry);

  for (const scope of scopes) {
    store.dispatch('scopesRegistry/addScope', scope);
  }
};

export const ScopesModule = {
  name: moduleName,
  install
};
