import { isEmpty } from '@deip/toolbox/lodash';
import { proxydi } from '@deip/proxydi';
import { callForCurrentUser } from '@deip/platform-store';
import { hasValue } from '@deip/toolbox';
import { AccessService } from '@deip/access-service';
import deipRpc from '@deip/rpc-client';
import { usersStore, currentUserStore } from './store';

const accessService = AccessService.getInstance();

const install = (Vue) => {
  if (install.installed) return;
  install.installed = true;

  if (!Vue.prototype.$deipModules) Vue.prototype.$deipModules = [];
  Vue.prototype.$deipModules.push('UsersModule');

  const store = proxydi.get('storeInstance');

  if (store) {
    store.registerModule('users', usersStore);
    store.registerModule('currentUser', currentUserStore);

    Object.defineProperty(Vue.prototype, '$currentUser', {
      get() {
        const data = this.$store.getters['currentUser/data'];

        let $currentUser = {};

        if (data) {
          $currentUser = {
            ...data,
            isAdmin: data.profile.roles.some((r) => r.role === 'admin'),
            memoKey: data.account.memo_key,
            privKey: accessService.getOwnerWif(),
            pubKey: deipRpc.auth.wifToPublic(accessService.getOwnerWif())
          };
        }

        Object.defineProperty($currentUser, 'exists', {
          enumerable: false,
          value: () => !isEmpty($currentUser)
        });

        Object.defineProperty($currentUser, 'await', {
          enumerable: false,
          value: (cb) => {
            const unwatch = this.$store
              .watch((_, getters) => getters['currentUser/data'], (currentUser) => {
                if (hasValue(currentUser)) {
                  cb();
                  unwatch();
                }
              });
          }
        });

        Object.defineProperty($currentUser, 'hasRole', {
          enumerable: false,
          value: (roleName, scope) => !!$currentUser.roles
            ?.find((role) => (role.role === roleName)
             && ((scope && role[scope.name] === scope.id) || !scope))
        });

        return $currentUser;
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
