import { usersStore } from './store';

const install = (Vue, options = {}) => {
  if (install.installed) return;
  install.installed = true;

  if (!Vue.prototype.$deipModules) Vue.prototype.$deipModules = [];
  Vue.prototype.$deipModules.push('UsersModule');

  const { store } = options;

  if (store) {
    store.registerModule('users', usersStore);
  } else {
    throw Error('[UsersModule]: storeInstance is not provided');
  }
};

export const UsersModule = {
  name: 'UsersModule',
  deps: [
    'ValidationPlugin',
    'VuetifyExtended',
    'EnvModule',
    'AuthModule'
  ],
  install
};
