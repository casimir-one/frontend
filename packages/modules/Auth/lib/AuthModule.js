import { ValidationPlugin } from '@deip/validation-plugin';
import { VuetifyExtended } from '@deip/vuetify-extended';
import { UsersModule } from '@deip/users-module';
import { AccessService } from '@deip/access-service';
import { proxydi } from '@deip/proxydi';

import { authStore } from './store';

const accessService = AccessService.getInstance();

const install = (Vue, options = {}) => {
  if (install.installed) return;
  install.installed = true;

  const {
    signInRedirect = 'home'
  } = options;

  const router = proxydi.get('routerInstance');
  const store = proxydi.get('storeInstance');

  if (store && router) {
    Vue.use(ValidationPlugin);
    Vue.use(VuetifyExtended);

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

    Vue.use(UsersModule);

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
    console.warn('Router and Store is not defined');
  }
};

export const AuthModule = {
  install
};

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(AuthModule);
}
