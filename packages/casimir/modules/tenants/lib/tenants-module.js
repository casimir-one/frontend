import { proxydi } from '@deip/proxydi';
import { tenantsStore, currentTenantStore } from './store';

const install = (Vue) => {
  if (install.installed) return;
  install.installed = true;

  const store = proxydi.get('storeInstance');

  if (store) {
    store.registerModule('tenants', tenantsStore);
    store.registerModule('currentTenant', currentTenantStore);

    store.dispatch('currentTenant/get');

    Vue.mixin({
      computed: {
        $currentTenant() { return this.$store.getters['currentTenant/data']; }
      }
    });
  } else {
    throw Error('[TenantsModule]: storeInstance is not provided');
  }
};

export const TenantsModule = {
  name: 'TenantsModule',
  deps: [
    'EnvModule'
  ],
  install
};
