import { isEmpty } from 'lodash';
import { SYSTEM_ROLE } from '@casimir/platform-core';
import { AccessService } from '@deip/access-service';
import { setLocalesMessages, hasValue, isNil } from '@deip/toolbox';
import { awaitForStore, callForCurrentUser } from '@deip/platform-util';

import { hasRoles } from './util/roles';
import { authStore, currentUserStore } from './store';

const accessService = AccessService.getInstance();
const locales = require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.js$/i);

const install = (Vue, options = {}) => {
  if (install.installed) return;
  install.installed = true;

  const { router, store, i18n } = options;

  if (i18n) {
    setLocalesMessages(i18n, locales);
  } else {
    throw Error('[AuthModule]: i18nInstance is not provided');
  }

  if (router) {
    router.beforeEach((to, from, next) => {
      // guests only routes
      if (to.matched.some((route) => route.meta.guestOnly)) {
        if (store.getters['auth/isLoggedIn']) {
          next({ name: store.getters['auth/settings'].signInRedirectRouteName });
          return;
        }
        next();
        return;
      }

      // routes for unauthenticated users
      if (to.meta.auth === false) {
        next();
        return;
      }

      // routes for authenticated users
      if (to.matched.some((r) => r.meta.auth)) {
        if (!store.getters['auth/isLoggedIn']) {
          next({ name: store.getters['auth/settings'].signInRouteName });
          return;
        }
      }

      awaitForStore(store, 'currentUser/data').then((userData) => {
        const userRoles = userData.roles;

        // admin has full access
        if (hasRoles(userRoles, SYSTEM_ROLE.ADMIN)) {
          next();
          return;
        }

        // check matched routes roles starting with parents
        const parentAuth = to.matched[0].meta.auth;
        let allowed = parentAuth === false || parentAuth.includes(SYSTEM_ROLE.ANY);

        for (const route of to.matched) {
          if (isNil(route.meta.auth)) {
            console.warn('Each route should have \'auth\' meta field');
          }

          if (route.meta.auth && !route.meta.auth.includes(SYSTEM_ROLE.ANY)) {
            allowed = hasRoles(userRoles, route.meta.auth);
          }
        }

        if (!allowed) {
          let redirectToRoute = { name: store.getters['auth/settings'].signInRedirectRouteName };
          if (to.meta.redirectTo) {
            redirectToRoute = { name: to.meta.redirectTo, params: to.params };
          }
          next(redirectToRoute);
        }

        next();
      });
    });
  } else {
    throw Error('[AuthModule]: routerInstance is not provided');
  }

  if (store) {
    store.registerModule('auth', authStore);
    store.registerModule('currentUser', currentUserStore);

    // authModule
    store.dispatch('auth/setup', options);

    Vue.mixin({
      computed: {
        $isUser() { return store.getters['auth/isLoggedIn']; },
        $isGuest() { return !this.$isUser; }
      }
    });

    store.dispatch('auth/restoreData');

    // currentUserModule
    Object.defineProperty(Vue.prototype, '$currentUser', {
      get() {
        const data = this.$store.getters['currentUser/data'];

        let $currentUser = {};

        if (data) {
          $currentUser = { ...data };

          Object.defineProperty($currentUser, 'isAdmin', {
            enumerable: false,
            value: data.roles.some((r) => r.role === 'admin')
          });

          Object.defineProperty($currentUser, 'privKey', {
            enumerable: false,
            value: accessService.getOwnerPrivKey()
          });

          Object.defineProperty($currentUser, 'pubKey', {
            enumerable: false,
            value: accessService.getOwnerPubKey()
          });
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
    throw Error('[AuthModule]: storeInstance is not provided');
  }
};

export const AuthModule = {
  name: 'AuthModule',
  deps: [
    'EnvModule',
    'ValidationPlugin',
    'VuetifyExtended'
  ],
  install
};
