import { proxydi } from '@deip/proxydi';
import { setLocalesMessages } from '@deip/toolbox';
import { awaitForStore } from '@deip/platform-store';
import { SYSTEM_ROLE } from '@deip/constants';

import { hasRoles } from './util/roles';
import { authStore } from './store';

const locales = require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.js$/i);

const install = (Vue, options = {}) => {
  if (install.installed) return;
  install.installed = true;

  const router = proxydi.get('routerInstance');
  const store = proxydi.get('storeInstance');
  const i18n = proxydi.get('i18nInstance');

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

      awaitForStore(store, 'auth/roles').then(() => {
        const userRoles = store.getters['auth/roles'];

        // admin has full access
        if (hasRoles(userRoles, SYSTEM_ROLE.ADMIN)) {
          next();
          return;
        }

        // check matched routes roles starting with parents
        let allowed = to.matched[0].meta.auth.includes(SYSTEM_ROLE.ANY);
        for (const route of to.matched) {
          if (!route.meta.auth) {
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
    store.dispatch('auth/setup', options);

    Vue.mixin({
      computed: {
        $isUser() { return store.getters['auth/isLoggedIn']; },
        $isGuest() { return !this.$isUser; }
      }
    });

    store.dispatch('auth/restoreData');
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
