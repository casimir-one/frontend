import { proxydi } from '@deip/proxydi';
import { tenantsStore, currentTenantStore } from './store';

const install = (Vue, options = {}) => {
  if (install.installed) return;
  install.installed = true;

  const store = proxydi.get('storeInstance');

  if (store) {
    store.registerModule('tenants', tenantsStore);
    store.registerModule('currentTenant', currentTenantStore);
  } else {
    throw Error('[TenantsModule]: storeInstance is not provided');
  }
};

export const TenantsModule = {
  name: 'TenantsModule',
  deps: [
    'EnvModule',
  ],
  install
};
