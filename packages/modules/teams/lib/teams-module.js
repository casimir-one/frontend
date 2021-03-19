import { proxydi } from "@deip/proxydi";
import { teamsStore } from './store';

const install = (Vue, options = {}) => {
  if (install.installed) return;
  install.installed = true;

  const store = proxydi.get('storeInstance')

  if (store) {
    store.registerModule('teams', teamsStore);

  } else {
    throw Error('[TeamsModule]: storeInstance is not provided');
  }
};

export const TeamsModule = {
  name: 'TeamsModule',
  deps: [
    'EnvModule',
    'ValidationPlugin',
    'VuetifyExtended'
  ],
  install
};
