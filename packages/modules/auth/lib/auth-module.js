import { proxydi } from '@deip/proxydi';
import { setLocalesMessages } from '@deip/toolbox';

import { authStore } from './store';

const locales = require.context('./locales', true, /[A-Za-z0-9-_,\s]+\.js$/i);

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

  if (router) {
    // for guests
    router.beforeEach((to, from, next) => {
      if (to.meta.requiresAuth) {
        if (store.getters['auth/isLoggedIn']) {
          next();
          return;
        }
        next({ name: signInRedirect });
      } else {
        next();
      }
    });

    // for users
    router.beforeEach((to, from, next) => {
      if (to.meta.guest) {
        if (store.getters['auth/isLoggedIn']) {
          next({ name: signInRedirect });
          return;
        }
        next();
      } else {
        next();
      }
    });

    Vue.prototype.$signInRedirect = signInRedirect;
  } else {
    throw Error('[AuthModule]: routerInstance is not provided');
  }

  if (store) {
    store.registerModule('auth', authStore);

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
