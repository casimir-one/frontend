import { ValidationPlugin } from '@deip/validation-plugin';
import { VuetifyExtended } from '@deip/vuetify-extended';

import { currentUserStore } from './store';

const install = (Vue, options = {}) => {
  if (install.installed) return;

  install.installed = true;

  if (options.store) {
    options.store.registerModule('CurrentUser', currentUserStore);

    Vue.use(ValidationPlugin);
    Vue.use(VuetifyExtended);

    Vue.mixin({
      computed: {
        $currentUser() { return this.$store.getters['CurrentUser/data']; }
      }
    });
  } else {
    console.warn('VUEX Store is not defined');
  }
};

export const CurrentUserModule = {
  install
};

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(CurrentUserModule);
}
