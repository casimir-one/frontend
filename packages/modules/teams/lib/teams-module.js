import { proxydi } from "@deip/proxydi";

import { ValidationPlugin } from '@deip/validation-plugin';
import { VuetifyExtended } from '@deip/vuetify-extended';

import { teamsStore } from './store';

const install = (Vue, options = {}) => {
  if (install.installed) return;
  install.installed = true;

  const store = proxydi.get('storeInstance')

  if (store) {
    store.registerModule('teams', teamsStore);

    Vue.use(ValidationPlugin);
    Vue.use(VuetifyExtended);

  } else {
    console.warn('VUEX Store is not defined');
  }
};

export const TeamsModule = {
  install
};

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(TeamsModule);
}
