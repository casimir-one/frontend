import { proxydi } from '@deip/proxydi';
import { portalsStore, currentPortalStore } from './store';

const install = (Vue) => {
  if (install.installed) return;
  install.installed = true;

  const store = proxydi.get('storeInstance');

  if (store) {
    store.registerModule('portals', portalsStore);
    store.registerModule('currentPortal', currentPortalStore);

    store.dispatch('currentPortal/get');

    Vue.mixin({
      computed: {
        $currentPortal() { return this.$store.getters['currentPortal/data']; }
      }
    });
  } else {
    throw Error('[PortalsModule]: storeInstance is not provided');
  }
};

export const PortalsModule = {
  name: 'PortalsModule',
  deps: [
    'EnvModule'
  ],
  install
};
