import { proxydi } from '@deip/proxydi';
import { callForCurrentUser } from '@deip/platform-fns';
import { hasValue } from '@deip/toolbox';
import { usersStore, currentUserStore } from './store';

const install = (Vue) => {
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
          return this.$currentUser.profile.roles.some((r) => r.role === 'admin');
        }
      },
      methods: {
        $awaitCurrentUser(cb) {
          const unwatch = this.$store
            .watch((_, getters) => getters['currentUser/data'], (currentUser) => {
              if (hasValue(currentUser)) {
                cb();
                unwatch();
              }
            });
        }
      }
    });

    callForCurrentUser(
      store,
      'currentUser/get',
      'currentUser/clear'
    );
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
