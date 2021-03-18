import { proxydi } from "@deip/proxydi";

import { ValidationPlugin } from '@deip/validation-plugin';
import { VuetifyExtended } from '@deip/vuetify-extended';

import { usersStore, currentUserStore } from './store';

const install = (Vue, options = {}) => {
  if (install.installed) return;
  install.installed = true;

  const store = proxydi.get('storeInstance')

  if (store) {
    store.registerModule(options.storeNamespace || 'users', usersStore);
    store.registerModule('currentUser', currentUserStore);

    Vue.use(ValidationPlugin);
    Vue.use(VuetifyExtended);

    Vue.mixin({
      computed: {
        $currentUser() { return this.$store.getters['currentUser/data']; },
        $isAdmin() {
          return true;
        }
      }
    });

  } else {
    console.warn('VUEX Store and Vue Router is not defined');
  }
};

export const UsersModule = {
  install
};

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(UsersModule);
}
