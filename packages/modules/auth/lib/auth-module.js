import { AccessService } from '@deip/access-service';
import { proxydi } from '@deip/proxydi';
import { setLocalesMessages } from '@deip/toolbox';

import { authStore } from './store';

const locales = require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.js$/i);

const accessService = AccessService.getInstance();

const install = (Vue, options = {}) => {
  if (install.installed) return;
  install.installed = true;

  const {
    signInRedirect = 'home'
  } = options;

  const router = proxydi.get('routerInstance');
  const store = proxydi.get('storeInstance');
  const i18n = proxydi.get('i18nInstance');

  if (i18n) {
    setLocalesMessages(i18n, locales);
  } else {
    throw Error('[AuthModule]: i18nInstance is not provided');
  }

  if (store && router) {
    // for guests
    router.beforeEach((to, from, next) => {
      if (to.matched.some((record) => record.meta.requiresAuth)) {
        if (store.getters['auth/isLoggedIn']) {
          next();
          return;
        }
        next('/sign-in'); // TODO: get from options
      } else {
        next();
      }
    });

    // for users
    router.beforeEach((to, from, next) => {
      if (to.matched.some((record) => record.meta.guest)) {
        if (store.getters['auth/isLoggedIn']) {
          next(signInRedirect);
          return;
        }
        next();
      } else {
        next();
      }
    });

    Vue.prototype.$signInRedirect = signInRedirect;

    // Store chore //////////////

    store.registerModule('auth', authStore);

    // Other //////////////

    Vue.mixin({
      computed: {
        $isUser() { return store.getters['auth/isLoggedIn']; },
        $isGuest() { return !this.$isUser; }
      }
    });

    if (accessService.isLoggedIn()) {
      store.dispatch('auth/restoreData');
      store.dispatch('currentUser/get');
    }
  } else {
    throw Error('[AuthModule]: routerInstance and storeInstance is not provided');
  }
};

export const AuthModule = {
  name: 'AuthModule',
  deps: [
    'EnvModule',
    'ValidationPlugin',
    'VuetifyExtended',
    'UsersModule'
  ],
  install
};
