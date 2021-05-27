import { proxydi } from '@deip/proxydi';
import { usersStore, currentUserStore } from './store';

// eslint-disable-next-line no-unused-vars
const install = (Vue, options = {}) => {
  if (install.installed) return;
  install.installed = true;

  if (!Vue.prototype.$deipModules) Vue.prototype.$deipModules = [];
  Vue.prototype.$deipModules.push('UsersModule');

  const store = proxydi.get('storeInstance');

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

    store.dispatch('currentUser/get');

    store.watch((_, getters) => getters['auth/username'], (username) => {
      if (username) {
        store.dispatch('currentUser/get');
      } else {
        store.dispatch('currentUser/clear');
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
    'EnvModule',
    'AuthModule'
  ],
  install
};
