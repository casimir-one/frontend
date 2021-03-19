import { proxydi } from "@deip/proxydi";
import { usersStore, currentUserStore } from './store';

const install = (Vue, options = {}) => {
  if (install.installed) return;
  install.installed = true;

  if (!Vue.prototype.$deipModules) Vue.prototype.$deipModules = [];
  Vue.prototype.$deipModules.push('UsersModule');

  const store = proxydi.get('storeInstance')

  if (store) {
    store.registerModule('users', usersStore);
    store.registerModule('currentUser', currentUserStore);

    Vue.mixin({
      computed: {
        $currentUser() { return this.$store.getters['currentUser/data']; },
        $isAdmin() {
          return true;
        }
      }
    });

  } else {
    throw Error('[UsersModule]: storeInstance is not provided');
  }
};

export const UsersModule = {
  name: 'UsersModule',
  deps: [
    'ValidationPlugin',
    'VuetifyExtended',
    'EnvModule'
  ],
  install
};
