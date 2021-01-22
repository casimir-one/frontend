import { ValidationPlugin } from '@deip/validation-plugin';
import { VuetifyExtended } from '@deip/vuetify-extended';

import { usersStore } from './store';

const install = (Vue, options = {}) => {
  if (install.installed) return;

  install.installed = true;

  if (options.store) {
    options.store.registerModule('Base', usersStore);

    Vue.use(ValidationPlugin);
    Vue.use(VuetifyExtended);

    Vue.mixin({
      computed: {
        $currentUser() { return this.$store.getters['Auth/currentUser']; }
      }
    });
  } else {
    console.warn('VUEX Store is not defined');
  }
};

export const UsersModule = {
  install
};

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(UsersModule);
}
