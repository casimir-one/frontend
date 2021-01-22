import { ValidationPlugin } from '@deip/validation-plugin';
import { VuetifyExtended } from '@deip/vuetify-extended';
import { CurrentUserModule } from '@deip/current-user-module';
import { AccessService } from '@deip/access-service';
import { proxydi } from '@deip/proxydi';

import { authStore } from './store';

const accessService = AccessService.getInstance();

const install = (Vue, options = {}) => {
  if (install.installed) return;
  install.installed = true;

  const router = proxydi.get('routerInstance')
  const store = proxydi.get('storeInstance')
  const authRedirectRouteName = proxydi.get('authRedirectRouteName')

  if (store && router) {
    Vue.use(ValidationPlugin);
    Vue.use(VuetifyExtended);

    // for guests
    router.beforeEach((to, from, next) => {
      if (to.matched.some((record) => record.meta.requiresAuth)) {
        if (store.getters['Auth/isLoggedIn']) {
          next();
          return;
        }
        next('/sign-in');
      } else {
        next();
      }
    });

    // for users
    router.beforeEach((to, from, next) => {
      if (to.matched.some((record) => record.meta.guest)) {
        if (store.getters['Auth/isLoggedIn']) {
          next(authRedirectRouteName || 'explore');
          return;
        }
        next();
      } else {
        next();
      }
    });

    Vue.prototype.$authRedirectRouteName = authRedirectRouteName || 'explore';

    // //////////////

    store.registerModule('Auth', authStore);

    Vue.use(CurrentUserModule, { store });

    Vue.mixin({
      computed: {
        $isUser() { return store.getters['Auth/isLoggedIn']; },
        $isGuest() { return !this.$isUser; }
      }
    });

    if (accessService.isLoggedIn()) {
      store.dispatch('Auth/restoreData');
      store.dispatch('CurrentUser/getData');
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
